"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { addToLocalCart } from "@/utils/cart";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";

interface Trophy {
  _id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  createdAt: string;
}

type SortType = "newest" | "oldest" | "priceLow" | "priceHigh";

export default function HomePage() {
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categorySort, setCategorySort] = useState<Record<string, SortType>>({});
  const itemsPerPage = 60;

  const router = useRouter();

  const fetchTrophies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/get-all-trophies");
      if (res.data.success) {
        setTrophies(res.data.data);
        setCarouselIndex(Math.floor(Math.random() * res.data.data.length));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch trophies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrophies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (trophies.length ? (prev + 1) % trophies.length : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [trophies]);

  const sortTrophies = (list: Trophy[], sort: SortType = "newest") => {
    const sorted = [...list];
    switch (sort) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "priceLow":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceHigh":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  const filteredTrophies = viewingCategory
    ? trophies.filter((t) => t.category === viewingCategory)
    : [];

  const paginatedTrophies = sortTrophies(
    filteredTrophies,
    categorySort[viewingCategory || ""] || "newest"
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Group by categories for homepage
  const getCategoriesWithTrophies = (list: Trophy[], limit = 12) => {
    const map: Record<string, Trophy[]> = {};
    list.forEach((t) => {
      const cat = t.category || "Uncategorized";
      if (!map[cat]) map[cat] = [];
      if (map[cat].length < limit) map[cat].push(t);
    });
    return map;
  };

  const handleAddToCart = (trophy: Trophy) => {
    addToLocalCart({
      trophyId: trophy._id,
      name: trophy.name,
      price: trophy.price,
      image: trophy.image || "",
      quantity: 1,
    });
    toast.success(`${trophy.name} added to cart!`);
  };

  const handleTrophyClick = (id: string) => router.push(`/get-trophy/${id}`);

  const nextCarousel = () => setCarouselIndex((prev) => (prev + 1) % trophies.length);
  const prevCarousel = () => setCarouselIndex((prev) => (prev - 1 + trophies.length) % trophies.length);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 text-gray-900 px-3 sm:px-6 py-10">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight"
        >
          AH Handicraft <span className="text-blue-600">Collections</span>
        </motion.h1>

        {/* Carousel */}
        <div className="relative w-full h-[200px] sm:h-[300px] overflow-hidden rounded-2xl shadow-lg bg-gray-200">
          <AnimatePresence mode="wait">
            {trophies.length > 0 && (
              <motion.div
                key={trophies[carouselIndex]._id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => handleTrophyClick(trophies[carouselIndex]._id)}
                className="relative w-full h-full cursor-pointer group"
              >
                <Image
                  src={trophies[carouselIndex].image || "/placeholder.png"}
                  alt={trophies[carouselIndex].name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 flex items-end justify-between px-6 pb-6 text-white">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold truncate">
                      {trophies[carouselIndex].name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-200">
                      ₹{trophies[carouselIndex].price.toLocaleString()}
                    </p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={prevCarousel}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextCarousel}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Homepage sections */}
        {!viewingCategory &&
          Object.entries(getCategoriesWithTrophies(trophies)).map(([cat, tList]) => (
            <div key={cat} className="my-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{cat}</h2>
                <button
                  onClick={() => { setViewingCategory(cat); setCurrentPage(1); }}
                  className="text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {tList.map((t) => (
                  <TrophyCard
                    key={t._id}
                    trophy={t}
                    onClick={() => handleTrophyClick(t._id)}
                    onAddToCart={() => handleAddToCart(t)}
                  />
                ))}
              </div>
            </div>
          ))}

        {/* View All / Pagination */}
        {viewingCategory && (
          <CategoryView
            trophies={paginatedTrophies}
            category={viewingCategory}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredTrophies.length}
            itemsPerPage={itemsPerPage}
            categorySort={categorySort}
            setCategorySort={setCategorySort}
            handleAddToCart={handleAddToCart}
            handleTrophyClick={handleTrophyClick}
            setViewingCategory={setViewingCategory}
          />
        )}
      </div>
    </div>
  );
}

// Trophy Card
const TrophyCard = ({ trophy, onClick, onAddToCart }: { trophy: Trophy; onClick?: () => void; onAddToCart?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 group"
    onClick={onClick}
  >
    <div className="relative h-28 sm:h-32">
      <Image
        src={trophy.image || "/placeholder.png"}
        alt={trophy.name}
        fill
        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
        {onAddToCart && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
            className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

// Category View Component with Select Dropdown
const CategoryView = ({
  trophies,
  category,
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  categorySort,
  setCategorySort,
  handleAddToCart,
  handleTrophyClick,
  setViewingCategory,
}: any) => {
  const sorts: { label: string; value: SortType }[] = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Price Low → High", value: "priceLow" },
    { label: "Price High → Low", value: "priceHigh" },
  ];

  return (
    <div className="my-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{category}</h2>
        <button
          onClick={() => setViewingCategory(null)}
          className="text-blue-600 hover:underline"
        >
          Back
        </button>
      </div>

      {/* Sorting using Select */}
      <div className="mb-4">
        <select
          className="px-3 py-2 border rounded-md bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={categorySort[category] || "newest"}
          onChange={(e) =>
            setCategorySort((prev: any) => ({ ...prev, [category]: e.target.value }))
          }
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {trophies.map((t: Trophy) => (
          <TrophyCard
            key={t._id}
            trophy={t}
            onClick={() => handleTrophyClick(t._id)}
            onAddToCart={() => handleAddToCart(t)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p: number) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
            onClick={() => setCurrentPage((p: number) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
