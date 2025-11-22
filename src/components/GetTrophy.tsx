"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Star,
  StarHalf,
  StarOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { addToLocalCart } from "@/utils/cart";

interface Trophy {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  discription?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId: { name: string; email: string };
  createdAt: string;
}

export default function TrophyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [trophy, setTrophy] = useState<Trophy | null>(null);
  const [related, setRelated] = useState<Trophy[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReviewBox, setShowReviewBox] = useState(false);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
      : 0;

  const renderStars = (value: number) => {
    const full = Math.floor(value);
    const half = value % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {Array(full)
          .fill(0)
          .map((_, i) => (
            <Star
              key={"f" + i}
              className="w-5 h-5 text-yellow-400 fill-yellow-400"
            />
          ))}

        {half && (
          <StarHalf className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        )}

        {Array(empty)
          .fill(0)
          .map((_, i) => (
            <StarOff key={"e" + i} className="w-5 h-5 text-gray-300" />
          ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = await axios.get(`/api/get-trophy/${id}`);
      if (res.data.success) {
        setTrophy(res.data.data.trophy);
        setRelated(res.data.data.related || []);
      } else {
        toast.error("Error loading trophy");
      }

      const rev = await axios.get(`/api/get-review?id=${id}`);
      if (rev.data.success) setReviews(rev.data.reviews);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!trophy) return;

    addToLocalCart({
      trophyId: trophy._id,
      name: trophy.name,
      price: trophy.price,
      image: trophy.image || "",
      quantity: 1,
    });

    toast.success(`${trophy.name} added to cart`);
  };

  const submitReview = async () => {
    if (!rating) return toast.error("Select rating");

    const res = await axios.post("/api/add-review", {
      rating,
      comment,
      trophyId: id,
    });

    if (res.data.success) {
      toast.success("Review added");

      const r = await axios.get(`/api/get-review?id=${id}`);
      setReviews(r.data.reviews);

      setRating(0);
      setComment("");
      setShowReviewBox(false);
    } else {
      toast.error(res.data.message);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );

  if (!trophy)
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Trophy not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-1/2 h-64 sm:h-80">
          <Image
            src={trophy.image || "/placeholder.png"}
            alt={trophy.name}
            fill
            className="object-contain rounded-xl"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-5">
          <h1 className="text-2xl sm:text-3xl font-bold">{trophy.name}</h1>

          <p className="text-sm text-gray-600">
            Category: {trophy.category || "N/A"}
          </p>

          <p className="text-2xl font-bold">₹{trophy.price}</p>

          <p className="text-gray-700">{trophy.discription}</p>

          <div className="flex items-center gap-2">
            {renderStars(avgRating)}
            <span className="text-gray-600 text-sm">
              {avgRating.toFixed(1)} ({reviews.length})
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl flex items-center gap-2 transition"
          >
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Write a Review</h2>

          <button
            onClick={() => setShowReviewBox(!showReviewBox)}
            className="p-2 border rounded-xl active:scale-95"
          >
            {showReviewBox ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {showReviewBox && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  onClick={() => setRating(s)}
                  className={`w-8 h-8 cursor-pointer ${
                    s <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border p-3 rounded-xl"
              placeholder="Write something"
            />

            <button
              onClick={submitReview}
              className="px-6 py-3 bg-black text-white rounded-xl active:scale-95"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-xl font-bold mb-6">Reviews</h2>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-white p-5 rounded-xl shadow border border-gray-100"
              >
                {renderStars(r.rating)}

                <p className="font-semibold mt-2">{r.userId?.name}</p>

                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>

      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Trophies</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {related.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4 text-center cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/get-trophy/${item._id}`)}
            >
              <div className="relative h-40 w-full">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-contain rounded-xl"
                />
              </div>

              <h3 className="mt-3 text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToLocalCart({
                    trophyId: item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image || "",
                    quantity: 1,
                  });
                  toast.success(`${item.name} added to cart`);
                }}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl w-full"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
