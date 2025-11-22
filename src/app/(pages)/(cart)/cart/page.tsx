"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { Loader2, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  trophyId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [altNumber, setAltNumber] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;

    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed: CartItem[] = JSON.parse(stored);
        setCart(parsed.map((item) => ({ ...item, quantity: item.quantity || 1 })));
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, [hydrated]);

  useEffect(() => {
    if (session?.user) setName(session.user.name || "");
  }, [session]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  if (!hydrated || status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading Cart...
      </div>
    );
  }

  const email = session?.user?.email || "";
  const mobile = session?.user?.mobileNumber || "";

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: string) => {
    toast.success("Item removed");
    setCart((prev) => prev.filter((i) => i.trophyId !== id));
  };

  const handleQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.trophyId === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
    );
  };

  const handleCheckout = async () => {
    if (!session?.user){
      toast.error("Please Login First !")
      return router.push("/sign-in")
    }

    if (!name.trim()) return toast.error("Enter name");
    const required = ["street", "city", "state", "postalCode"];
    for (let key of required) {
      // @ts-ignore
      if (!address[key]) return toast.error(`Enter ${key}`);
    }

    try {
      setLoading(true);

      const payload = {
        items: cart.map(({ trophyId, quantity, price }) => ({
          trophyId,
          quantity,
          price,
        })),
        totalAmount,
        address,
        alternateNumber: altNumber || null,
      };

      const res = await axios.post("/api/place-order", payload);

      if (res.status === 201) {
        toast.success("Order placed!");
        localStorage.removeItem("cart");
        router.push("/my-orders");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 tracking-tight">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center text-xl mt-10">Your cart is empty</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CART ITEMS */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.trophyId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.price}</p>

                      <div className="mt-2 flex items-center gap-3 bg-gray-100 px-3 rounded-lg py-1">
                        <button
                          onClick={() => handleQuantity(item.trophyId, -1)}
                          className="hover:bg-gray-200 cursor-pointer rounded p-1"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="font-medium">{item.quantity}</span>

                        <button
                          onClick={() => handleQuantity(item.trophyId, 1)}
                          className="hover:bg-gray-200 cursor-pointer rounded p-1"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.trophyId)}
                    className="text-red-500 cursor-pointer hover:text-red-700"
                  >
                    <Trash2 />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* NAME */}
            <div className="mb-3">
              <label className="font-medium">Name</label>
              <input
                type="text"
                value={name}
                className="w-full border p-2 rounded mt-1"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="font-medium">Email</label>
              <input
                type="text"
                readOnly
                className="w-full border p-2 rounded bg-gray-100 mt-1"
                value={email}
              />
            </div>

            {/* MOBILE */}
            <div className="mb-3">
              <label className="font-medium">Mobile</label>
              <input
                type="text"
                readOnly
                className="w-full border p-2 rounded bg-gray-100 mt-1"
                value={mobile}
              />
            </div>

            {/* ADDRESS */}
            <h3 className="text-md font-semibold mt-5 mb-2">Shipping Address</h3>

            {Object.entries(address).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label className="font-medium capitalize">{key}</label>
                <input
                  type="text"
                  value={value}
                  className="w-full border p-2 rounded mt-1"
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                />
              </div>
            ))}

            {/* ALT NUMBER */}
            <div className="mb-3">
              <label className="font-medium">Alternate Number</label>
              <input
                type="text"
                value={altNumber}
                className="w-full border p-2 rounded mt-1"
                onChange={(e) => setAltNumber(e.target.value)}
              />
            </div>

            {/* TOTAL */}
            <div className="border-t pt-4 mt-4 flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg text-lg mt-5 hover:bg-blue-700 transition flex justify-center items-center"
            >
              {loading && <Loader2 className="animate-spin mr-2" size={20} />}
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
