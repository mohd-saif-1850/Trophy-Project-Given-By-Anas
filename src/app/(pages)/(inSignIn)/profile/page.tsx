"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Edit3, BugIcon,ShoppingBag, Heart, ShoppingCartIcon,MapPin, ChevronRight, Shield } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", mobileNumber: "" });

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/get-user");
      if (res.data.success) {
        setUser(res.data.user);
        setForm({ name: res.data.user.name || "", mobileNumber: res.data.user.mobileNumber || "" });
      } else {
        toast.error(res.data.message || "Authentication required");
        router.push("/sign-in");
      }
    } catch {
      toast.error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await axios.patch("/api/auth/update-user", form);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile updated");
        setEditing(false);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl font-semibold text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-linear-to-br from-gray-50 to-gray-100 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 border border-gray-100"
      >
        <div className="flex flex-col items-center mb-12">
          <motion.img
            src="https://res.cloudinary.com/dlzi244at/image/upload/v1763367677/defaultPersonImage_exseqc.avif"
            className="w-32 h-32 rounded-full object-cover shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="mt-6 text-4xl font-bold text-gray-900 tracking-tight">{user?.name}</h1>
          <p className="text-gray-600 flex items-center gap-2 mt-2 text-sm"><Mail className="w-4 h-4" /> {user?.email}</p>
          <p className="text-gray-600 flex items-center gap-2 mt-1 text-sm"><Phone className="w-4 h-4" /> {user?.mobileNumber || "No number added"}</p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-[0.97] w-fit mx-auto mb-12"
          >
            <Edit3 className="w-5 h-5" /> Edit Profile
          </button>
        )}

        {editing && (
          <form onSubmit={handleUpdate} className="space-y-8 mb-12 bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                <User className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                <Phone className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={form.mobileNumber}
                  onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                  className="flex-1 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                disabled={updating}
                className={`px-6 py-3 rounded-xl cursor-pointer text-white font-semibold transition-all flex items-center gap-2 ${
                  updating ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
                type="submit"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-3 cursor-pointer rounded-xl text-gray-700 font-semibold border border-gray-300 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => router.push("/cart")}
            className="p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
              <span className="font-semibold text-gray-800 text-lg">View Cart</span>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-500" />
          </div>

          <div
            onClick={() => router.push("/my-orders")}
            className="p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              <span className="font-semibold text-gray-800 text-lg">Your Orders</span>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-500" />
          </div>

          <div
            onClick={() => router.push("/report")}
            className="p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <BugIcon className="w-6 h-6" />
              <span className="font-semibold text-gray-800 text-lg">Send Feedback</span>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}