import React from "react";

const DashboardContent = () => {
  return (
    <div className="container py-20">
      <div className=" bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">📊 URL Dashboard</h1>
        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Short URL</th>
                <th className="p-3 text-left">Original URL</th>
                <th className="p-3 text-center">Visits</th>
                <th className="p-3 text-center">History</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 text-blue-600 underline">
                  <Link
                    to={`http://localhost:8000/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    http://localhost:8000/
                  </Link>
                </td>
                <td className="p-3 truncate max-w-xs"></td>
                <td className="p-3 text-center font-semibold"></td>
                <td className="p-3 text-center">
                  <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visit History Modal */}
        
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Visit History</h2>

              <p className="text-sm mb-2">
                <span className="font-semibold">Short URL:</span>
                http://localhost:8000/
              </p>

              <div className="max-h-60 overflow-y-auto border rounded">
                <p className="p-4 text-gray-500">No visits yet</p>

                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">hello </td>
                      <td className="p-2">Hacker</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900">
                Close
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardContent;
