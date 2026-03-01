import React, { useState } from "react";
import { Link2, BarChart3, Copy, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [urlInput, setUrlInput] = useState("");
  const [guestUrls, setGuestUrls] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState(null);


  const handleCopy = async (shortCode, id) => {
    const fullUrl = `https://shortner-server.vercel.app/${shortCode}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this URL?")) {
      setGuestUrls(guestUrls.filter((url) => url.id !== id));
    }
  };

  return (
    <div className="min-h-[93vh] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Shorten Your URLs
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
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
