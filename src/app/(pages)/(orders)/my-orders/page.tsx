"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { Trash2, Eye, X } from "lucide-react";

interface PopulatedTrophy {
  _id: string;
  name: string;
  image: string;
  price: number;
  msg?: string
}

interface OrderItem {
  trophyId: PopulatedTrophy;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryDate?: string;
  msg?: string
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false)

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/my-order");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) fetchOrders();
  }, [session]);

  const cancelOrder = async (orderId: string) => {
    try {
      setDeleting(true)
      const res = await axios.delete(`/api/delete-order?id=${orderId}`);

      if (res.data.success) {
        toast.success("Order cancelled");
        fetchOrders();
        setConfirmCancelId(null);
        setDeleting(false)
      } else {
        toast.error(res.data.message || "Failed to cancel order");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  if (!session)
    return <p className="text-center mt-10">Please login to view your orders.</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">You have no orders yet.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {orders.map((order) => {
            const firstItem = order.items[0]?.trophyId;
            const previewImage = firstItem?.image;
            const expanded = expandedOrders.includes(order._id);

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status.toLowerCase() === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status.toLowerCase() === "shipped"
                        ? "bg-pink-300 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-500 text-sm">Placed on: {new Date(order.createdAt).toLocaleString()}</p>

                {order.deliveryDate && (
                  <p className="text-gray-500 text-sm">Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                )}

                {order.msg && (
                  <p className="text-pink-500 text-sm">Cancelled Message: <span className="text-red-500 text-sm">{order.msg}</span></p>
                )}

                {previewImage && (
                  <div className="mt-3">
                    <Image
                      src={previewImage}
                      alt={firstItem?.name || "Order preview image"}
                      width={140}
                      height={140}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <p className="font-semibold text-lg">Total: {formatINR(order.totalAmount)}</p>

                  <div className="flex gap-3">
                    <button
                      className="flex cursor-pointer items-center gap-1 px-3 py-1 border rounded hover:bg-gray-100"
                      onClick={() => toggleExpand(order._id)}
                    >
                      <Eye size={16} />
                      {expanded ? "Hide" : "View"}
                    </button>

                    {order.status.toLowerCase() === "pending" && (
                      <button
                        className="flex cursor-pointer items-center gap-1 px-3 py-1 border rounded hover:bg-red-100 text-red-600"
                        onClick={() => setConfirmCancelId(order._id)}
                      >
                        <Trash2 size={16} /> Cancel
                      </button>
                    )}
                  </div>
                </div>

                {expanded && (
                  <div className="mt-6 border-t pt-4 space-y-4">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-xl">Order Details</h3>
                      <button className="text-gray-500 cursor-pointer hover:text-black" onClick={() => toggleExpand(order._id)}>
                        <X size={22} />
                      </button>
                    </div>

                    {order.items.map((item) => {
                      const trophy = item.trophyId;

                      return (
                        <div key={item.trophyId._id} className="flex gap-4 items-center border-b pb-3">
                          <Image
                            src={trophy?.image || "https://via.placeholder.com/80?text=No+Image"}
                            alt={trophy?.name || "Item image"}
                            width={70}
                            height={70}
                            className="rounded-lg object-cover"
                          />

                          <div className="flex-1">
                            <p className="font-semibold">{trophy?.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} × {formatINR(item.price)}
                            </p>
                          </div>

                          <p className="font-semibold">{formatINR(item.quantity * item.price)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {confirmCancelId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white cursor-pointer p-6 rounded-xl shadow-lg space-y-4 max-w-sm w-full">
            <p>Are you sure you want to cancel this order?</p>
            <div className="flex justify-end gap-4">
              {!deleting ? (<button className="px-4 cursor-pointer py-2 rounded border" onClick={() => setConfirmCancelId(null)}>
                No
              </button>) : (
                <p></p>
              )}

              {deleting ? (
                <button className="px-4 cursor-not-allowed py-2 rounded bg-green-600 text-white" onClick={() => cancelOrder(confirmCancelId)} disabled>
                  Canceling...
                </button>
              ) : (
                <button className="px-4 py-2 cursor-pointer rounded bg-red-600 text-white" onClick={() => cancelOrder(confirmCancelId)}>
                  Yes, Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
