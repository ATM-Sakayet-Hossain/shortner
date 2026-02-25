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
      const message =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Login failed. Please try again.";
      return { success: false, error: message };
    }
  };

  const register = async (userName, email, password) => {
    try {
      const data = await registerMutation({
        userName,
        email,
        password,
      }).unwrap();
      const token =
        data?.accessToken ||
        data?.token ||
        data?.jwt ||
        data?.access_token ||
        data?.data?.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
      }

      const registeredUser = data?.user || data?.data || data;
      setUser(registeredUser || null);
      setIsAuthenticated(!!registeredUser);

      return { success: true };
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Registration failed. Please try again.";
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
