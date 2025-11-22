"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return toast.error("Please enter all 6 digits");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || "Verification failed");
      else {
        toast.success(data.message);
        router.push("/sign-in");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || "Failed to resend OTP");
      else {
        toast.success("OTP resent successfully");
        setTimer(60);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white shadow-lg border border-gray-200 rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3 tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          We’ve sent a 6-digit OTP to{" "}
          <span className="font-medium text-blue-600">{email}</span>.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }
                }
                type="digit"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 md:w-12 md:h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 cursor-pointer hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Didn’t get the code?{" "}
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`font-medium transition ${
              timer > 0 || resending
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 cursor-pointer hover:text-blue-700"
            }`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
