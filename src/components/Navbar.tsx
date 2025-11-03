"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Bug,
  Info,
  Phone,
  Home,
} from "lucide-react"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    toast.success("You have been logged out!");
    setTimeout(() => router.push("/"), 2500);
  }

  const linkClass = (path: string) =>
    `transition hover:text-blue-600 ${
      pathname === path ? "text-blue-600 font-semibold" : "text-gray-700"
    }`

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-semibold tracking-wide text-gray-800">
          A.H <span className="text-blue-600">Handicraft</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          {!session ? (
            <>
              <Link href="/sign-in" className={linkClass("/sign-in")}>
                Login
              </Link>
              <Link href="/sign-up" className={linkClass("/sign-up")}>
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link href="/cart" className={linkClass("/cart")}>
                <div className="flex items-center gap-1">
                  <ShoppingCart size={18} /> Cart
                </div>
              </Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <div className="flex flex-col p-4 space-y-4 text-gray-700">
            <Link href="/" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/")}`}>
              <Home size={18} /> Home
            </Link>

            {!session ? (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 ${linkClass("/sign-in")}`}
                >
                  <User size={18} /> Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 ${linkClass("/sign-up")}`}
                >
                  <User size={18} /> Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 ${linkClass("/cart")}`}
                >
                  <ShoppingCart size={18} /> Cart
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 ${linkClass("/profile")}`}
                >
                  <User size={18} /> Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 ${linkClass("/orders")}`}
                >
                  <Info size={18} /> My Orders
                </Link>
              </>
            )}

            <hr className="border-gray-200" />

            {/* Common Links */}
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 ${linkClass("/about")}`}
            >
              <Info size={18} /> About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 ${linkClass("/contact")}`}
            >
              <Phone size={18} /> Contact Us
            </Link>
            <Link
              href="/report"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 ${linkClass("/report")}`}
            >
              <Bug size={18} /> Report a Bug
            </Link>

            {/* Logout BELOW after report bug */}
            {session && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Dropdown */}
      {menuOpen && (
        <div className="hidden md:absolute md:right-10 md:top-16 md:bg-white md:border md:rounded-xl md:shadow-md md:w-60 md:flex md:flex-col p-3 space-y-3">
          {!session ? (
            <>
              <Link href="/about" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/about")}`}>
                <Info size={18} /> About Us
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/contact")}`}>
                <Phone size={18} /> Contact Us
              </Link>
              <Link href="/report" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/report")}`}>
                <Bug size={18} /> Report a Bug
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/profile")}`}>
                <User size={18} /> Profile
              </Link>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/orders")}`}>
                <Info size={18} /> My Orders
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/about")}`}>
                <Info size={18} /> About Us
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/contact")}`}>
                <Phone size={18} /> Contact Us
              </Link>
              <Link href="/report" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${linkClass("/report")}`}>
                <Bug size={18} /> Report a Bug
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
