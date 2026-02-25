import React, { useState, useEffect, useMemo } from "react";
import { Link2, BarChart3, Copy, ExternalLink, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import {
  useGetShortUrlsQuery,
  useCreateShortUrlMutation,
  useDeleteShortUrlMutation,
} from "../services/api";

const Dashboard = () => {
  const [urlInput, setUrlInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [formError, setFormError] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isInitialLoading,
    isFetching,
    isError,
    error,
  } = useGetShortUrlsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [createShortUrl, { isLoading: isCreating }] =
    useCreateShortUrlMutation();
  const [deleteShortUrl, { isLoading: isDeleting }] =
    useDeleteShortUrlMutation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isInitialLoading && !isFetching) {
      navigate("/login");
    }
  }, [isAuthenticated, isInitialLoading, isFetching, navigate]);

  const userUrls = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((url) => ({
      id: url._id,
      shortCode: url.urlShort,
      originalUrl: url.urlLong,
      clicks: url.visitHistory?.length || 0,
      createdAt: new Date(url.createdAt).toLocaleDateString(),
    }));
  }, [data]);

  const handleCreateUrl = async () => {
    if (!urlInput.trim()) {
      setFormError("Please enter a URL");
      return;
    }

    setFormError("");

    try {
      await createShortUrl(urlInput.trim()).unwrap();
      setUrlInput("");
      // List will auto-refresh via invalidatesTags
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.error ||
        "Failed to create short URL. Please try again.";
      setFormError(message);
    }
  };

  const handleCopy = async (shortCode, id) => {
    const fullUrl = `http://localhost:1993/${shortCode}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (id) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    try {
      await deleteShortUrl(id).unwrap();
      // Cache invalidation will refresh list
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (isInitialLoading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total URLs</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {userUrls.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Link2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {userUrls.reduce((sum, url) => sum + url.clicks, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Today</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {
                    userUrls.filter(
                      (url) =>
                        url.createdAt === new Date().toLocaleDateString(),
                    ).length
                  }
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create URL Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Shorten a URL
          </h3>
          {(formError || (isError && error)) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {formError ||
                  error?.data?.message ||
                  error?.error ||
                  "Something went wrong"}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateUrl()}
              placeholder="Enter your long URL here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isCreating}
            />
            <button
              onClick={handleCreateUrl}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Shortening..." : "Shorten"}
            </button>
          </div>
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Your URLs</h3>
          </div>

          {userUrls.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No URLs yet. Create your first short URL!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userUrls.map((url) => (
                <div key={url.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <a
                          href={`http://localhost:1993/${url.shortCode}`}
                          className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          localhost:1993/{url.shortCode}
                        </a>
                        <button
                          onClick={() => handleCopy(url.shortCode, url.id)}
                          className="text-gray-400 hover:text-gray-600 transition"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copiedId === url.id && (
                          <span className="text-sm text-green-600 font-medium">
                            Copied!
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm break-all mb-2">
                        {url.originalUrl}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{url.clicks} clicks</span>
                        <span>•</span>
                        <span>Created {url.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Visit original URL"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(url.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition"
                        title="Delete URL"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
