"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md bg-gray-800 w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        <input
          type="text"
          placeholder="Email or Mobile Number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700 focus:outline-none"
        />

        {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
