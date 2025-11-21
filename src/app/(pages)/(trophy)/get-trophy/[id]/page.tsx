"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

interface Trophy {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  discription?: string;
}

export default function TrophyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trophy, setTrophy] = useState<Trophy | null>(null);
  const [related, setRelated] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Trophy[]>([]);

  useEffect(() => {
    const fetchTrophy = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/get-trophy/${id}`);
        if (res.data.success) {
          setTrophy(res.data.data.trophy);
          setRelated(res.data.data.related || []);
        } else {
          toast.error(res.data.message || "Failed to load trophy details");
        }
      } catch (error: any) {
        toast.error("Error fetching trophy details");
      } finally {
        setLoading(false);
      }
    };

    fetchTrophy();
  }, [id]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleAddToCart = (item: Trophy) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${item.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-700">
        Loading trophy details...
      </div>
    );
  }

  if (!trophy) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-700">
        Trophy not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 bg-white rounded-2xl shadow-md p-8">
        <div className="relative w-full md:w-1/2 h-80">
          <Image
            src={trophy.image || "/placeholder.png"}
            alt={trophy.name}
            fill
            className="object-contain rounded-xl"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-semibold">{trophy.name}</h1>
          <p className="text-gray-500">
            Category: {trophy.category || "None"}
          </p>
          <p className="text-lg font-medium text-gray-800">
            ₹{trophy.price.toFixed(2)}
          </p>
          <p className="text-gray-600">
            {trophy.discription || "No description available."}
          </p>

          <button
            onClick={() => handleAddToCart(trophy)}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-6">Related Trophies</h2>
        {related.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {related.slice(0, 20).map((item) => (
              <div
                key={item._id}
                onClick={() => router.push(`/get-trophy/${item._id}`)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center cursor-pointer"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <h3 className="mt-3 text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                  className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No related trophies found.</p>
        )}
      </div>
    </div>
  );
}
