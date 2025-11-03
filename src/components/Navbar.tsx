"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!session?.user;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-2xl font-bold tracking-wide text-gray-800">
          AH <span className="text-blue-600">Handicraft</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/orders">My Orders</Link>
          <Link href="/address">Address</Link>
          <Link href="/cart" className="flex items-center gap-1">
            <ShoppingCart size={20} />
            Cart
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/profile">Profile</Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in">Login</Link>
              <Link
                href="/sign-up"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white shadow-lg px-6 py-4 space-y-3 text-gray-700 font-medium"
          >
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
            <Link href="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
            <Link href="/address" onClick={() => setMenuOpen(false)}>Address</Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>

            {isLoggedIn ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
