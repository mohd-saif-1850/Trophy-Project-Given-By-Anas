"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Package,
  Phone,
  MapPin,
  CalendarClock,
  X,
  Check,
  Pencil,
  Filter,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Trophy {
  _id: string;
  name: string;
  image: string;
  price: number;
}

export interface OrderItem {
  trophyId: Trophy;
  quantity: number;
  price: number;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  address: OrderAddress;
  msg?: string;
  totalAmount: number;
  status: "Pending" | "Shipped" | "Completed" | "Cancelled" | string;
  email: string;
  primaryNumber?: string;
  alternateNumber?: string | null;
  deliveryDate?: string;
  createdAt: string;
  otp?: string | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"Pending" | "Shipped" | "Completed" | "Cancelled">("Pending");
  const [editingStatusFor, setEditingStatusFor] = useState<string | null>(null);
  const [statusSelectValue, setStatusSelectValue] = useState<string>("");
  const [showCancelModalFor, setShowCancelModalFor] = useState<string | null>(null);
  const [cancelMsg, setCancelMsg] = useState<string>("");
  const [showOtpModalFor, setShowOtpModalFor] = useState<string | null>(null);
  const [otpInputs, setOtpInputs] = useState<string[]>(["", "", "", "", "", ""]);
  const [rangePreset, setRangePreset] = useState<"all" | "7d" | "30d" | "custom">("all");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");

  const formatINR = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
      }),
    []
  );

  const formatPrice = (n: number) => `₹${formatINR.format(n)}`;

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/all-orders");
      if (res.data?.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch {
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredByTab = useMemo(() => {
    const now = new Date();
    let fromDate: Date | null = null;
    if (rangePreset === "7d") {
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (rangePreset === "30d") {
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (rangePreset === "custom") {
      if (customFrom) fromDate = new Date(customFrom);
    }
    const toDate = rangePreset === "custom" && customTo ? new Date(customTo) : null;

    return orders.filter((o) => {
      if (o.status?.toLowerCase() !== activeTab.toLowerCase()) return false;
      if (!fromDate && !toDate) return true;
      const created = new Date(o.createdAt);
      if (fromDate && created < fromDate) return false;
      if (toDate && created > new Date(toDate.getTime() + 24 * 60 * 60 * 1000 - 1)) return false;
      return true;
    });
  }, [orders, activeTab, rangePreset, customFrom, customTo]);

  const openEdit = (order: Order) => {
    setEditingStatusFor(order._id);
    setStatusSelectValue(order.status || "Pending");
  };

  const applyStatusChange = async (orderId: string) => {
    if (!statusSelectValue) {
      toast.error("Select status");
      return;
    }
    if (statusSelectValue.toLowerCase() === "cancelled") {
      setShowCancelModalFor(orderId);
      setEditingStatusFor(null);
      return;
    }
    try {
      if (statusSelectValue.toLowerCase() === "completed") {
        const res = await axios.put(`/api/update-order-status?id=${orderId}`, {
          status: "Completed",
        });
        if (res.data?.success) {
          toast.success("Completed status requested. OTP sent to user");
          setShowOtpModalFor(orderId);
          loadOrders();
        } else {
          toast.error(res.data?.message || "Failed to update");
        }
      } else {
        const res = await axios.put(`/api/update-order-status?id=${orderId}`, {
          status: statusSelectValue,
        });
        if (res.data?.success) {
          toast.success("Status updated");
          loadOrders();
        } else {
          toast.error(res.data?.message || "Failed to update");
        }
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setEditingStatusFor(null);
    }
  };

  const submitCancel = async (orderId: string) => {
    try {
      const res = await axios.put(`/api/update-order-status?id=${orderId}`, {
        status: "Cancelled",
        msg: cancelMsg || undefined,
      });
      if (res.data?.success) {
        toast.success("Order cancelled and user notified");
        setShowCancelModalFor(null);
        setCancelMsg("");
        loadOrders();
      } else {
        toast.error(res.data?.message || "Failed to cancel");
      }
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const submitOtpVerify = async (orderId: string) => {
    const otp = otpInputs.join("");
    if (otp.length !== 6) {
      toast.error("Enter 6 digits OTP");
      return;
    }
    try {
      const res = await axios.post(`/api/verify-order-otp?id=${orderId}`, { otp });
      if (res.data?.success) {
        toast.success("OTP verified. Order completed");
        setShowOtpModalFor(null);
        setOtpInputs(["", "", "", "", "", ""]);
        loadOrders();
      } else {
        toast.error(res.data?.message || "OTP verification failed");
      }
    } catch {
      toast.error("OTP verification error");
    }
  };

  const renderStatusBadge = (s: string) => {
    const st = s.toLowerCase();
    const base = "px-3 py-1 rounded-full text-sm font-medium";
    if (st === "pending") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
    if (st === "shipped") return <span className={`${base} bg-blue-100 text-blue-800`}>Shipped</span>;
    if (st === "completed") return <span className={`${base} bg-green-100 text-green-800`}>Completed</span>;
    if (st === "cancelled") return <span className={`${base} bg-red-100 text-red-800`}>Cancelled</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{s}</span>;
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Orders</h1>
            <p className="text-sm text-gray-600 mt-1">View, filter and update order statuses</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1">
              <Filter size={16} />
              <select
                value={rangePreset}
                onChange={(e) => setRangePreset(e.target.value as any)}
                className="outline-none"
              >
                <option value="all">All time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            {rangePreset === "custom" && (
              <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1">
                <CalendarDays size={16} />
                <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="text-sm" />
                <span className="text-sm px-1">—</span>
                <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="text-sm" />
              </div>
            )}

            <div className="bg-white border rounded-lg px-3 py-1">
              <div className="flex gap-2">
                {(["Pending", "Shipped", "Completed", "Cancelled"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeTab === t ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-600">Loading orders…</div>
        ) : filteredByTab.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {filteredByTab.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
              >
                <div className="md:col-span-3 flex gap-4 items-center">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                    <Image
                      src={order.items[0]?.trophyId?.image || "/placeholder.png"}
                      alt={order.items[0]?.trophyId?.name || "image"}
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-lg flex items-center gap-2">
                      <Package size={16} />
                      <span className="truncate">Order #{String(order._id).slice(-8)}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-2">{renderStatusBadge(order.status)}</div>
                  </div>
                </div>

                <div className="md:col-span-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{order.email}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Phone size={14} />
                        {order.primaryNumber || "-"}
                      </p>
                      {order.alternateNumber && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone size={14} />
                          {order.alternateNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Shipping</p>
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <MapPin size={14} />
                        {order.address.street}, {order.address.city}, {order.address.state}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.address.postalCode}, {order.address.country}
                      </p>
                      {order.deliveryDate && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <CalendarClock size={14} />
                          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((it) => (
                      <div key={it.trophyId._id} className="flex items-center gap-3 border-b pb-3">
                        <div className="w-14 h-14 relative rounded-md overflow-hidden bg-gray-100">
                          <Image src={it.trophyId.image || "/placeholder.png"} alt={it.trophyId.name} fill sizes="56px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{it.trophyId.name}</p>
                          <p className="text-sm text-gray-600">{it.quantity} × {formatPrice(it.price)}</p>
                        </div>
                        <div className="font-semibold">{formatPrice(it.price * it.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col gap-3 items-stretch">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold mt-1">{formatPrice(order.totalAmount)}</p>
                    {order.msg && order.status.toLowerCase() === "cancelled" && (
                      <div className="mt-3 text-sm text-red-700 bg-red-50 p-2 rounded">
                        {order.msg}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingStatusFor === order._id ? (
                      <>
                        <select className="flex-1 border rounded px-2 py-1" value={statusSelectValue} onChange={(e) => setStatusSelectValue(e.target.value)}>
                          <option>Pending</option>
                          <option>Shipped</option>
                          <option>Completed</option>
                          <option>Cancelled</option>
                        </select>
                        <button onClick={() => applyStatusChange(order._id)} className="px-3 py-2 bg-green-600 text-white rounded">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingStatusFor(null)} className="px-3 py-2 bg-gray-200 rounded">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openEdit(order)} className="flex-1 px-3 py-2 border rounded bg-white hover:bg-gray-50">
                          <Pencil size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showCancelModalFor && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                <h3 className="text-lg font-semibold">Cancel Order</h3>
                <p className="text-sm text-gray-600">Provide a message to send to the customer (optional).</p>
                <textarea value={cancelMsg} onChange={(e) => setCancelMsg(e.target.value)} className="w-full border rounded p-3 h-28" placeholder="Reason for cancellation (optional)"></textarea>
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowCancelModalFor(null); setCancelMsg(""); }} className="px-4 py-2 border rounded">Close</button>
                  <button onClick={() => submitCancel(showCancelModalFor)} className="px-4 py-2 bg-red-600 text-white rounded">Confirm Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showOtpModalFor && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
                <h3 className="text-lg font-semibold text-center">Enter OTP to Complete Order</h3>
                <p className="text-sm text-gray-600 text-center">An OTP was sent to the user. Enter it here to verify and mark order completed.</p>

                <div className="flex justify-center gap-2 mt-2">
                  {otpInputs.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      value={val}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 1);
                        const copy = [...otpInputs];
                        copy[idx] = v;
                        setOtpInputs(copy);
                        if (v && idx < otpInputs.length - 1) {
                          const next = document.getElementById(`otp-${idx + 1}`) as HTMLInputElement | null;
                          next?.focus();
                        }
                        if (!v && idx > 0) {
                          const prev = document.getElementById(`otp-${idx - 1}`) as HTMLInputElement | null;
                          prev?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center border rounded text-lg"
                    />
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowOtpModalFor(null); setOtpInputs(["", "", "", "", "", ""]); }} className="px-4 py-2 border rounded">Cancel</button>
                  <button onClick={() => submitOtpVerify(showOtpModalFor)} className="px-4 py-2 bg-blue-600 text-white rounded">Verify OTP</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
