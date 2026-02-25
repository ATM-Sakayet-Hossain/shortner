import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const hasToken = Boolean(localStorage.getItem("accessToken"));

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  useEffect(() => {
    if (profile && !isProfileError) {
      const profileUser = profile.user || profile.data || profile;
      setUser(profileUser || null);
      setIsAuthenticated(!!profileUser);
    } else if (isProfileError) {
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [profile, isProfileError]);

  const login = async (email, password) => {
    try {
      const data = await loginMutation({ email, password }).unwrap();
      const token =
        data?.accessToken ||
        data?.token ||
        data?.jwt ||
        data?.access_token ||
        data?.data?.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
      }

      const loggedInUser = data?.user || data?.data || data;
      setUser(loggedInUser || null);
      setIsAuthenticated(!!loggedInUser);

      return { success: true };
    } catch (err) {
      // Enhanced error handling to capture backend error details
      console.error("Login error:", err);
      
      // Handle text error responses (backend may return plain text)
      let message = "Login failed. Please try again.";
      
      if (err?.data) {
        // If data is a string (text response), use it directly
        if (typeof err.data === 'string') {
          message = err.data;
        } else {
          // Otherwise try to extract from JSON structure
          message =
            err.data?.message ||
            err.data?.error ||
            err.data?.errors?.[0]?.msg ||
            err.data?.errors?.[0]?.message ||
            message;
        }
      } else if (err?.error) {
        message = typeof err.error === 'string' ? err.error : err.error?.message || message;
      } else if (err?.message) {
        message = err.message;
      }
      
      return { success: false, error: message };
    }
  };

  const register = async ({ userName, email, password }) => {
    try {
      // Trim whitespace from inputs before sending to backend
      const trimmedName = userName?.trim() || "";
      const trimmedEmail = email?.trim() || "";
      
      // Validate trimmed values
      if (!trimmedName) {
        return { success: false, error: "Name is required" };
      }
      if (!trimmedEmail) {
        return { success: false, error: "Email is required" };
      }
      
      // Try multiple field name variations - backend might expect 'userName' since that's what the form uses
      const payload = {
        userName: trimmedName, // Try userName first (matches form field name)
        name: trimmedName, // Also include name as fallback
        email: trimmedEmail, // Trimmed email
        password,
      };
      
      // Detailed logging for debugging
      console.log("=== Registration Debug ===");
      console.log("Original userName:", userName);
      console.log("Trimmed name:", trimmedName);
      console.log("Name length:", trimmedName.length);
      console.log("Email:", trimmedEmail);
      console.log("Full payload:", JSON.stringify(payload, null, 2));
      console.log("========================");
      
      const data = await registerMutation(payload).unwrap();
      
      // Log the full response to see what backend returns
      console.log("=== Registration Response ===");
      console.log("Full response data:", data);
      console.log("Response keys:", Object.keys(data || {}));
      console.log("=============================");
      
      const token =
        data?.accessToken ||
        data?.token ||
        data?.jwt ||
        data?.access_token ||
        data?.data?.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
        console.log("Token saved:", token.substring(0, 20) + "...");
      } else {
        console.warn("No token received in response!");
      }

      const registeredUser = data?.user || data?.data || data;
      console.log("Registered user:", registeredUser);
      
      // If no token, user needs to login separately
      // Set user data if available, but don't mark as authenticated without token
      if (registeredUser && typeof registeredUser === 'object' && registeredUser !== null && !registeredUser.message) {
        setUser(registeredUser);
        setIsAuthenticated(true);
      } else {
        // Backend only returned success message, no user data/token
        // User needs to login separately
        setUser(null);
        setIsAuthenticated(false);
      }

      return { success: true, data, needsLogin: !token };
    } catch (err) {
      // Enhanced error handling to capture backend error details
      console.error("Registration error:", err);
      
      // Handle text error responses (backend returns plain text like "Name are required")
      let message = "Registration failed. Please try again.";
      
      if (err?.data) {
        // If data is a string (text response), use it directly
        if (typeof err.data === 'string') {
          message = err.data;
        } else {
          // Otherwise try to extract from JSON structure
          message =
            err.data?.message ||
            err.data?.error ||
            err.data?.errors?.[0]?.msg ||
            err.data?.errors?.[0]?.message ||
            message;
        }
      } else if (err?.error) {
        message = typeof err.error === 'string' ? err.error : err.error?.message || message;
      } else if (err?.message) {
        message = err.message;
      }
      
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading: isProfileLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
