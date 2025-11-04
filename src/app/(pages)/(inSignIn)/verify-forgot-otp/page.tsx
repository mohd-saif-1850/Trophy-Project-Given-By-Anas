"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyForgotOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") || "";
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-forgot-otp", {
        identifier,
        otp: otpValue,
      });

      if (res.data.success) {
        toast.success("OTP verified successfully!");
        router.push(`/change-password?identifier=${identifier}`);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Enter the 6-digit code sent to your email to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3 sm:gap-4">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => {
                    inputsRef.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                whileFocus={{ scale: 1.08 }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold tracking-wide transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Didn’t receive the code?{" "}
            <span
              onClick={() => router.push(`/forgot-password?identifier=${identifier}`)}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Resend OTP
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
