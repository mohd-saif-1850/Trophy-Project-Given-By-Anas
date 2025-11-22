"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Star, CheckCircle, Clock, Search } from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadFeedbacks = async () => {
    setLoading(true);
    const res = await axios.get("/api/get-all-feedback");
    if (res.data.success) setFeedbacks(res.data.feedbacks);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "pending" | "approved") => {
    const res = await axios.patch(`/api/update-feedback-status?id=${id}`, {
      status,
    });
    if (res.data.success) {
      toast.success("Status updated");
      loadFeedbacks();
    } else toast.error(res.data.message);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const filtered = feedbacks.filter((f: any) => {
    const matchesSearch =
      f.comment.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : f.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">Manage Feedback</h1>

      <div className="flex gap-4 mb-8">
        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow w-72">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback..."
            className="ml-2 w-full outline-none"
          />
        </div>

        <select
          className="px-4 py-2 rounded-xl bg-white shadow"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600 text-lg">No feedback found</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((f: any) => (
            <div
              key={f._id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
            >
              <div className="flex justify-between mb-3">
                <div className="flex gap-2 items-center">
                  {f.status === "approved" ? (
                    <CheckCircle className="text-green-600 w-5 h-5" />
                  ) : (
                    <Clock className="text-yellow-600 w-5 h-5" />
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      f.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {f.status}
                  </span>
                </div>

                <button
                  onClick={() =>
                    updateStatus(
                      f._id,
                      f.status === "approved" ? "pending" : "approved"
                    )
                  }
                  className="px-4 py-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  {f.status === "approved" ? "Mark Pending" : "Approve"}
                </button>
              </div>

              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      f.rating && i <= f.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="font-semibold">{f.name}</p>
              <p className="text-sm text-gray-600 mb-3">{f.email}</p>
              <p className="text-gray-800 mb-3">{f.comment}</p>

              {f.reply && f.reply !== "No Reply Yet !" && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-xl">
                  <p className="font-semibold">Reply</p>
                  <p>{f.reply}</p>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                {new Date(f.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
