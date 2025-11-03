"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { motion } from "framer-motion"
import { addToLocalCart } from "@/utils/cart"

interface Trophy {
  _id: string
  name: string
  price: number
  image?: string
  createdAt: string
}

export default function HomePage() {
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchTrophies = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/get-all-trophies")
      if (res.data.success) {
        const all = res.data.data
        const start = (page - 1) * 10
        const end = start + 10
        setTrophies(all.slice(start, end))
        setHasMore(end < all.length)
      }
    } catch (error: any) {
      console.error("Error fetching trophies:", error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrophies()
  }, [page])

  const handleAddToCart = (trophy: Trophy) => {
    addToLocalCart({
      trophyId: trophy._id,
      name: trophy.name,
      price: trophy.price,
      image: trophy.image || "",
      quantity: 1,
    })
    alert(`${trophy.name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">
          🏆 Explore Our Trophies
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : trophies.length === 0 ? (
          <p className="text-center text-gray-500">No trophies available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {trophies.map((trophy, i) => (
              <motion.div
                key={trophy._id}
                className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={trophy.image || "/placeholder.png"}
                    alt={trophy.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{trophy.name}</h2>
                  <p className="text-gray-700 font-medium mb-3">
                    ₹{trophy.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleAddToCart(trophy)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 border rounded-lg ${
              page === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "hover:bg-gray-100 border-gray-300"
            }`}
          >
            ← Previous
          </button>
          <button
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 border rounded-lg ${
              !hasMore
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "hover:bg-gray-100 border-gray-300"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
