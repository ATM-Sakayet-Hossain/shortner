import React, { useState } from "react";
import { Link2, BarChart3, Copy, ExternalLink, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useCreateShortUrlMutation } from "../services/api";

const Home = () => {
  const [urlInput, setUrlInput] = useState("");
  const [guestUrls, setGuestUrls] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createShortUrl, { isLoading: isCreating }] =
    useCreateShortUrlMutation();

  // Load guest URLs from localStorage on mount
  React.useEffect(() => {
    const savedUrls = localStorage.getItem("guestUrls");
    if (savedUrls) {
      try {
        setGuestUrls(JSON.parse(savedUrls));
      } catch (e) {
        console.error("Error loading guest URLs:", e);
      }
    }
  }, []);

  // Save guest URLs to localStorage whenever they change
  React.useEffect(() => {
    if (guestUrls.length > 0) {
      localStorage.setItem("guestUrls", JSON.stringify(guestUrls));
    } else {
      localStorage.removeItem("guestUrls");
    }
  }, [guestUrls]);

  const handleCreateUrl = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a URL");
      return;
    }

    // If user is authenticated, redirect to dashboard
    if (user) {
      navigate("/dashboard");
      return;
    }

    setError("");

    try {
      const data = await createShortUrl(urlInput.trim()).unwrap();
      if (data) {
        const shortCode = data.urlShort || data.shortUrl || data.shortCode;
        const originalUrl = data.urlLong || data.longUrl || urlInput.trim();

        if (!shortCode) {
          throw new Error("Failed to create short URL. Please try again.");
        }

        const newUrl = {
          id: Date.now().toString(),
          shortCode,
          originalUrl,
          clicks: 0,
          createdAt: new Date().toLocaleDateString(),
        };
        setGuestUrls([newUrl, ...guestUrls]);
        setUrlInput("");
      }
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.error ||
        err.message ||
        "Failed to create short URL. Please try again.";
      setError(message);
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

  const handleDelete = (id) => {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this URL?")) {
      setGuestUrls(guestUrls.filter((url) => url.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Shorten Your URLs
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Instantly
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create short, memorable links in seconds. No login required!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Sign up to save your links, track clicks,
              and manage them from anywhere!
            </p>
          </div>
        </div>

        {/* URL Shortener */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Create Short URL
          </h3>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateUrl()}
              placeholder="Paste your long URL here..."
              className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-lg"
              disabled={isCreating}
            />
            <button
              onClick={handleCreateUrl}
              disabled={isCreating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Shortening..." : "Shorten URL"}
            </button>
          </div>
        </div>

        {/* Recent URLs */}
        {guestUrls.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                Your Shortened URLs
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {!user &&
                  "These links are saved in your browser. Sign up to save them permanently!"}
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {guestUrls.map((url) => (
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
          </div>
        )}

        {/* Features Section */}
        {guestUrls.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Shortening</h3>
              <p className="text-gray-600">
                Create short links instantly without any registration
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Performance</h3>
              <p className="text-gray-600">
                Sign up to track clicks and analyze your links
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Copy className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Sharing</h3>
              <p className="text-gray-600">
                Copy and share your links with a single click
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
