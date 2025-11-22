"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORM_KEY,
          name: form.name,
          email: form.email,
          message: form.message
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent successfully");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-6 text-gray-900">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-extrabold tracking-tight">
            Contact Us
          </h1>

          <p className="text-lg text-gray-600">
            Have questions, custom trophy requirements, or want to place a bulk order?
            Reach out to us anytime. We would love to assist you.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start bg-white p-5 rounded-2xl shadow border border-gray-200">
              <MapPin className="w-7 h-7 text-blue-600" />
              <div>
                <h3 className="font-semibold text-lg">Our Address</h3>
                <p className="text-gray-700">
                  ALA HAZRAT HANDICRAFT<br />
                  Pandia, Kundarki, Bilari<br />
                  Muradabad – 2024131 (UP)
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white p-5 rounded-2xl shadow border border-gray-200">
              <Phone className="w-7 h-7 text-blue-600" />
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-gray-700">+91 9876543210</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white p-5 rounded-2xl shadow border border-gray-200">
              <Mail className="w-7 h-7 text-blue-600" />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-gray-700">support@ahhandicraft.com</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="h-64 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
          >
            <iframe
              src="https://www.google.com/maps?q=Muradabad,+Uttar+Pradesh&output=embed"
              className="w-full h-full"
              loading="lazy"
            ></iframe>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

          <div className="space-y-5">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 min-h-[140px] focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              disabled={loading}
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl text-white text-lg font-semibold flex items-center justify-center gap-2 transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              <Send className="w-5 h-5" />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
