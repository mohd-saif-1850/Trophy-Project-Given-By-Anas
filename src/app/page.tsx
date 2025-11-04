"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { addToLocalCart } from "@/utils/cart"
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react"

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
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  const fetchTrophies = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/get-all-trophies")
      if (res.data.success) {
        const all = res.data.data
        setTrophies(all)
        setHasMore(all.length > 0)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrophies()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (trophies.length ? (prev + 1) % trophies.length : 0))
    }, 3500)
    return () => clearInterval(interval)
  }, [trophies])

  const handleAddToCart = (trophy: Trophy) => {
    addToLocalCart({
      trophyId: trophy._id,
      name: trophy.name,
      price: trophy.price,
      image: trophy.image || "",
      quantity: 1,
    })
  }

  const handleTrophyClick = (id: string) => {
    router.push(`/get-trophy/${id}`)
  }

  const nextSlide = () => setCurrent((prev) => (prev + 1) % trophies.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + trophies.length) % trophies.length)

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 text-gray-900 px-3 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight"
        >
          AH Handicraft <span className="text-blue-600">Collections</span>
        </motion.h1>

        <div className="relative w-full h-[200px] sm:h-[300px] overflow-hidden rounded-2xl shadow-lg bg-gray-200">
          <AnimatePresence mode="wait">
            {trophies.length > 0 && (
              <motion.div
                key={trophies[current]._id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => handleTrophyClick(trophies[current]._id)}
                className="relative w-full h-full cursor-pointer group"
              >
                <Image
                  src={trophies[current].image || "/placeholder.png"}
                  alt={trophies[current].name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 flex items-end justify-between px-6 pb-6 text-white">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">{trophies[current].name}</h2>
                    <p className="text-sm text-gray-200">₹{trophies[current].price}</p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : trophies.length === 0 ? (
          <p className="text-center text-gray-500">No trophies available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {trophies.map((trophy, i) => (
              <motion.div
                key={trophy._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleTrophyClick(trophy._id)}
                className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-28 sm:h-32">
                  <Image
                    src={trophy.image || "/placeholder.png"}
                    alt={trophy.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
                <div className="p-2 sm:p-3">
                  <h2 className="text-xs sm:text-sm font-semibold truncate">{trophy.name}</h2>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-700 text-xs sm:text-sm font-medium">
                      ₹{trophy.price.toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(trophy)
                      }}
                      className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
