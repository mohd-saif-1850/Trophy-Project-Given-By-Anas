"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AddTrophyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    discription: "",
    image: null as File | null,
    priority: "7", // default priority
  });

  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const MAX_WORDS = 500;

  const [categories, setCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/get-all-trophies");
        if (res.data.success) {
          const cats: string[] = Array.from(
            new Set(
              res.data.data
                .map((t: any) => t.category)
                .filter((c: any): c is string => typeof c === "string" && c.trim() !== "")
            )
          );
          setCategories(cats);
        }
      } catch (error) {
        console.log("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setFilteredCategories([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, category: e.target.value });

    if (e.target.value.trim() === "") {
      setFilteredCategories([]);
    } else {
      const filtered = categories.filter((c) =>
        c.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      toast.error("Access denied");
      router.push("/");
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "discription") {
      const chars = value.length;
      if (chars <= MAX_WORDS) {
        setForm({ ...form, [name]: value });
        setWordCount(chars);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Trophy name is required");
      return false;
    }
    if (!form.price.trim() || Number(form.price) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!form.image) {
      toast.error("Please upload an image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("discription", form.discription);
      data.append("priority", form.priority);

      if (form.image) data.append("image", form.image);

      const res = await axios.post("/api/add-trophy", data);

      if (res.data.success) {
        toast.success(res.data.message || "Trophy added successfully");

        // RESET FORM INCLUDING PRIORITY
        setForm({
          name: "",
          price: "",
          category: "",
          discription: "",
          image: null,
          priority: "7",
        });

        setWordCount(0);
      } else {
        toast.error(res.data.message || "Failed to add trophy");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Internal Server Error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white shadow-lg border border-gray-200 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add New Trophy
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter trophy name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div ref={categoryRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={form.category}
              onChange={handleCategoryChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
            />
            {filteredCategories.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-40 overflow-auto shadow-lg">
                {filteredCategories.map((cat, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => {
                      setForm({ ...form, category: cat });
                      setFilteredCategories([]);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <span
                className={`text-xs ${
                  wordCount >= MAX_WORDS * 0.9
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {MAX_WORDS - wordCount} Characters Left
              </span>
            </div>
            <textarea
              name="discription"
              placeholder="Write a short description"
              value={form.discription}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 cursor-pointer hover:bg-indigo-700"
            }`}
          >
            {loading ? "Adding..." : "Add Trophy"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
