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
  User2,
  OctagonIcon,
  UserCircle,
  ShoppingBag
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface Trophy {
  _id: string;
  name: string;
  image?: string;
}

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
      } catch {}
    };
    fetchSuggestions();
  }, [search]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out!");
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

  // Desktop Links
  let desktopLinks: { href: string; label: string; icon?: any }[] = [{ href: "/", label: "Home" }];
  if (isUser) desktopLinks.push({ href: "/cart", label: "Cart", icon: ShoppingCart });
  if (isAdmin) {
    desktopLinks.push({ href: "/manage-trophies", label: "Manage Trophies" });
    desktopLinks.push({ href: "/get-all-orders", label: "All Orders" });
  }
  if (!session) {
    desktopLinks.push({ href: "/sign-in", label: "Login" });
    desktopLinks.push({ href: "/sign-up", label: "Signup" });
  }

  // Hamburger / Mobile Links (only extra links)
  let mobileLinks: { href: string; label: string; icon: any }[] = [];
  if (!session) {
    mobileLinks = [
      { href: "/", label: "Home", icon: Home },
      { href: "/sign-in", label: "Login", icon: User2 },
      { href: "/sign-up", label: "Sign Up", icon: UserCircle },
      { href: "/about", label: "About Us", icon: Info },
      { href: "/contact", label: "Contact Us", icon: Phone },
      { href: "/report", label: "Report a Bug", icon: Bug },
    ];
  } else if (isUser) {
    mobileLinks = [
      { href: "/", label: "Home", icon: Home },
      { href: "/cart", label: "Cart", icon: ShoppingCart },
      { href: "/profile", label: "Profile", icon: User },
      { href: "/my-orders", label: "My Orders", icon: ShoppingBag },
      { href: "/about", label: "About Us", icon: Info },
      { href: "/contact", label: "Contact Us", icon: Phone },
      { href: "/report", label: "Report a Bug", icon: Bug },
    ];
  } else if (isAdmin) {
    mobileLinks = [
      { href: "/", label: "Home", icon: Home },
      { href: "/get-all-orders", label: "All Orders", icon: ShoppingBag },
      { href: "/manage-trophies", label: "Manage Trophies", icon: OctagonIcon },
      { href: "/all-reports", label: "All Reports", icon: Bug },
    ];
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-6 py-4">
        <Link
          href="/"
          className="md:text-2xl font-semibold text:sm tracking-wide text-gray-800"
        >
          A.H <span className="text-blue-600">Handicraft</span>
        </Link>

        <div className="flex-1 mx-4 relative" ref={searchRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-100 rounded-full px-1 py-2 w-full md:max-w-lg mx-auto text-sm"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trophies..."
              className="bg-transparent outline-none px-1 md:px-2 text-sm w-full"
            />
            <button
              type="submit"
              className="text-gray-600 cursor-pointer hover:text-blue-600 p-1"
            >
              <Search size={18} />
            </button>
          </form>

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
                  <span className="w-20">{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center space-x-6">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 ${linkClass(link.href)}`}
              >
                {link.icon && <link.icon size={18} />} {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 cursor-pointer rounded-md hover:bg-gray-100 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute right-6 md:right-10 top-16 bg-white border rounded-xl shadow-md w-64 md:w-60 flex flex-col p-4 space-y-3 z-50">
          
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 ${linkClass(link.href)}`}
            >
              <link.icon size={18} /> {link.label}
            </Link>
          ))}

          {session && (
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
