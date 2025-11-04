"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  Search,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface Trophy {
  _id: string;
  name: string;
  image?: string;
}

const ADMIN_LINKS = [
  { href: "/admin", label: "Admin Panel", icon: Shield },
  { href: "/admin/trophies", label: "Manage Trophies", icon: Bug },
  { href: "/admin/orders", label: "All Orders", icon: Info },
];

const USER_LINKS = [
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/orders", label: "My Orders", icon: Info },
  { href: "/profile", label: "Profile", icon: User },
];

const PUBLIC_LINKS = [
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/report", label: "Report a Bug", icon: Bug },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Trophy[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const role = session?.user?.role;
  const email = session?.user?.email;
  const isAdmin = role === "admin" || email === "admin@handicraft.com";
  const isUser = role === "user";
  const routes = [...(isAdmin ? ADMIN_LINKS : isUser ? USER_LINKS : [])];

  // Add Home at the top
  const allRoutes = [{ href: "/", label: "Home", icon: Home }, ...routes];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close suggestion dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Live search suggestions
  useEffect(() => {
    if (!search.trim()) return setSuggestions([]);
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get("/api/get-all-trophies");
        const matches = res.data.data
          .filter((t: Trophy) =>
            t.name.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 5);
        setSuggestions(matches);
      } catch (error) {}
    };
    fetchSuggestions();
  }, [search]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("You have been logged out!");
    setTimeout(() => router.push("/"), 1200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return toast.error("Please enter a search term");
    router.push(`/get-trophy/${q}`);
    setSearch("");
    setSuggestions([]);
    setMenuOpen(false);
  };

  const linkClass = (path: string) =>
    `transition hover:text-blue-600 ${
      pathname === path ? "text-blue-600 font-semibold" : "text-gray-700"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-wide text-gray-800"
        >
          A.H <span className="text-blue-600">Handicraft</span>
        </Link>

        {/* Search */}
        <div className="flex-1 mx-4 relative" ref={searchRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 max-w-lg mx-auto"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trophies..."
              className="bg-transparent outline-none px-2 text-sm w-full"
            />
            <button
              type="submit"
              className="text-gray-600 hover:text-blue-600 p-1"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Suggestions with images */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border rounded-md shadow mt-1 z-50">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    router.push(`/get-trophy/${item._id}`);
                    setSearch("");
                    setSuggestions([]);
                    setMenuOpen(false);
                  }}
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-10 h-10 object-contain rounded-md"
                  />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desktop & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            {allRoutes.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                <div className="flex items-center gap-1">
                  <Icon size={18} /> {label}
                </div>
              </Link>
            ))}
          </div>

          {/* Hamburger for both desktop & mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute right-6 md:right-10 top-16 bg-white border rounded-xl shadow-md w-64 md:w-60 flex flex-col p-4 space-y-3 z-50">
          {!session ? (
            <>
              {PUBLIC_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 ${linkClass(href)}`}
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}
            </>
          ) : (
            <>
              {allRoutes.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 ${linkClass(href)}`}
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}

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
  );
}
