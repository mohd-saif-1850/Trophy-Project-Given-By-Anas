"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Star, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";

interface Feedback {
  _id: string;
  name: string;
  email: string;
  comment: string;
  rating: number | null;
  reply: string;
  status: "pending" | "approved";
  createdAt: string;
}

export default function FeedbackPage() {
  const { data: session, status } = useSession();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?._id) fetchFeedbacks();
  }, [session]);

  const fetchFeedbacks = async () => {
    try {
      const f = await axios.get(`/api/get-feedback?id=${session?.user?._id}`);
      if (f.data.success) setFeedbacks(f.data.feedbacks);
    } catch {
      toast.error("Failed to load your feedback");
    }
  };

  const submitFeedback = async () => {
    if (!comment.trim()) return toast.error("Enter your message");

    setLoading(true);

    try {
      const res = await axios.post("/api/add-feedback", {
        name: session?.user?.name,
        email: session?.user?.email,
        comment,
        rating: rating || null,
      });

      if (res.data.success) {
        toast.success("Feedback submitted");
        setComment("");
        setRating(0);
        setHoverRating(0);
        fetchFeedbacks();
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async () => {
    if (!deleteId) return;

    try {
      const res = await axios.delete(`/api/delete-feedback?id=${deleteId}`);

      if (res.data.success) {
        toast.success("Feedback deleted");
        setFeedbacks((prev) => prev.filter((f) => f._id !== deleteId));
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error deleting feedback");
    } finally {
      setDeleteId(null);
    }
  };

  if (status === "loading")
    return (
      <div className="h-screen flex justify-center items-center text-lg">
        Loading...
      </div>
    );

  if (!session)
    return (
      <div className="h-screen flex justify-center items-center text-lg">
        Please login to send feedback
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-200 py-10 px-4 text-gray-900">
      <div className="max-w-4xl mx-auto">

        {/* Feedback Form */}
        <div className="backdrop-blur-lg bg-white/60 shadow-2xl rounded-2xl p-8 border border-white/40">
          <h1 className="text-4xl font-extrabold text-center mb-8 tracking-tight">
            Send Feedback / Report Issue
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-1">Rate your experience</h2>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => {
                const filled = (hoverRating || rating) >= i;
                return (
                  <Star
                    key={i}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                    className={`w-9 h-9 cursor-pointer transition-all ${
                      filled ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                );
              })}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your feedback clearly..."
              className="w-full rounded-2xl p-4 min-h-[140px] bg-white/70 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              disabled={loading}
              onClick={submitFeedback}
              className={`mt-5 w-full py-3 rounded-xl text-white text-lg font-semibold shadow-lg transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>

        {/* Previous Feedback */}
        <h2 className="text-3xl font-bold mt-12 mb-6">
          Your Previous Feedback
        </h2>

        {feedbacks.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No feedback submitted yet
          </p>
        ) : (
          <div className="space-y-6 mt-10">
            {feedbacks.map((f) => (
              <div
                key={f._id}
                className="relative bg-white shadow-lg border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      f.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {f.status}
                  </span>

                  <button
                    onClick={() => setDeleteId(f._id)}
                    className="p-2 rounded-full hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
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

                <p className="text-gray-800 mb-3 leading-relaxed">
                  {f.comment}
                </p>

                {f.reply && f.reply !== "No Reply Yet !" && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-lg mb-2">
                    <p className="font-semibold">Admin Reply</p>
                    <p className="text-gray-700">{f.reply}</p>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  {new Date(f.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center relative">
            <h2 className="text-xl font-bold mb-3">Delete Feedback?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="w-1/2 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteFeedback}
                className="w-1/2 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>

            <button
              onClick={() => setDeleteId(null)}
              className="absolute top-4 right-4"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
