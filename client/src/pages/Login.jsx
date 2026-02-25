import React, { useState } from "react";
import { Link2 } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result && !result.success) {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
      <div className="flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Link2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Login to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/registration"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Register
              </Link>
            </p>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-700 mt-2 text-sm block"
            >
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
