"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiRefreshCw } from "react-icons/fi";

interface Trophy {
  _id: string;
  name: string;
  price: number;
  category?: string;
  discription?: string;
  image?: string;
  priority?: number;
  createdAt?: string;
}

type SortOption = "priority" | "newest" | "oldest" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";

export default function ManageTrophiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // UI state
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("priority");

  // Pagination (simple)
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Modal state
  const [deleteTarget, setDeleteTarget] = useState<Trophy | null>(null);
  const [editTarget, setEditTarget] = useState<Trophy | null>(null);
  const [modalOpen, setModalOpen] = useState<"delete" | "edit" | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    discription: "",
    image: null as File | null,
    priority: "7",
  });
  const [processing, setProcessing] = useState(false);

  // Require admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      toast.error("Access denied");
      router.push("/");
    }
  }, [session, status, router]);

  const fetchTrophies = async (showToast = false) => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await axios.get("/api/get-all-trophies");
      if (res.data.success) {
        // ensure priority exists as number
        const list: Trophy[] = res.data.data.map((t: any) => ({
          ...t,
          priority: typeof t.priority === "number" ? t.priority : Number(t.priority) || 7,
        }));
        setTrophies(list);
        if (showToast) toast.success("Trophies refreshed");
      } else {
        setFetchError(res.data.message || "Failed to fetch trophies");
        toast.error(res.data.message || "Failed to fetch trophies");
      }
    } catch (err: any) {
      setFetchError(err?.message || "Error fetching trophies");
      toast.error("Error fetching trophies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrophies();
  }, []);

  // derive categories
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(trophies.map((t) => t.category).filter(Boolean)))];
  }, [trophies]);

  // filtered + searched + sorted list
  const filtered = useMemo(() => {
    let list = [...trophies];

    // search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (t) =>
          (t.name && t.name.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          (t.discription && t.discription.toLowerCase().includes(q))
      );
    }

    // category filter
    if (filterCategory !== "All") {
      list = list.filter((t) => t.category === filterCategory);
    }

    // sort
    switch (sortBy) {
      case "priority":
        list.sort((a, b) => (a.priority ?? 7) - (b.priority ?? 7)); // smaller number = higher priority
        break;
      case "newest":
        list.sort((a, b) => (new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()));
        break;
      case "oldest":
        list.sort((a, b) => (new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime()));
        break;
      case "priceAsc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "nameDesc":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        break;
    }

    return list;
  }, [trophies, query, filterCategory, sortBy]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSlice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handlers
  const openEditModal = (t: Trophy) => {
    setEditTarget(t);
    setEditForm({
      name: t.name || "",
      price: String(t.price ?? ""),
      category: t.category || "",
      discription: t.discription || "",
      image: null,
      priority: String(t.priority ?? 7),
    });
    setModalOpen("edit");
  };

  const openDeleteModal = (t: Trophy) => {
    setDeleteTarget(t);
    setModalOpen("delete");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setProcessing(true);
    // optimistic update: remove locally
    const prev = trophies;
    setTrophies((s) => s.filter((x) => x._id !== deleteTarget._id));
    try {
      const res = await axios.delete(`/api/delete-trophy?id=${deleteTarget._id}`);
      if (res.data.success) {
        toast.success(res.data.message || "Deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete");
        setTrophies(prev); // rollback
      }
    } catch (err) {
      toast.error("Error deleting trophy");
      setTrophies(prev); // rollback
    } finally {
      setProcessing(false);
      setDeleteTarget(null);
      setModalOpen(null);
    }
  };

  const handleEditSubmit = async () => {
    if (!editTarget) return;
    // basic validation
    if (!editForm.name.trim()) return toast.error("Name required");
    if (!editForm.price || Number(editForm.price) <= 0) return toast.error("Valid price required");
    setProcessing(true);

    try {
      const data = new FormData();
      data.append("id", editTarget._id);
      data.append("name", editForm.name);
      data.append("price", editForm.price);
      data.append("category", editForm.category);
      data.append("discription", editForm.discription);
      data.append("priority", editForm.priority);
      if (editForm.image) data.append("image", editForm.image);

      const res = await axios.put("/api/update-trophy", data);

      if (res.data.success) {
        toast.success(res.data.message || "Updated successfully");
        // update local list: fetch or optimistic update
        await fetchTrophies();
        setModalOpen(null);
        setEditTarget(null);
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (err) {
      toast.error("Error updating trophy");
    } finally {
      setProcessing(false);
    }
  };

  // UI helpers
  const clearFilters = () => {
    setQuery("");
    setFilterCategory("All");
    setSortBy("priority");
    setPage(1);
  };

  // If not admin or loading
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-2 w-full max-w-4xl px-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow animate-pulse h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Manage Trophies</h1>
            <p className="text-sm text-gray-500">Total: {trophies.length} trophies</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><FiSearch /></div>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by name, category or description..."
                className="pl-10 pr-3 py-2 rounded-lg border w-full md:w-96"
              />
            </div>

            <button
              onClick={() => fetchTrophies(true)}
              title="Refresh"
              className="p-2 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
            >
              <FiRefreshCw />
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/add-trophy")}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
            >
              <FiPlus /> Add
            </motion.button>
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 mb-6">
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }} className="px-3 cursor-pointer py-2 border rounded-lg">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="px-3 cursor-pointer py-2 border rounded-lg">
            <option value="priority">Priority (1 → 7)</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
            <option value="nameAsc">Name A → Z</option>
            <option value="nameDesc">Name Z → A</option>
          </select>

          <button onClick={clearFilters} className="px-3 py-2 border rounded-lg cursor-pointer bg-white hover:bg-gray-50">Clear</button>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageSlice.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No trophies found. Try clearing filters or add new trophies.</p>
            </div>
          ) : (
            pageSlice.map((trophy) => (
              <motion.div
                key={trophy._id}
                className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-28 h-28 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={trophy.image || "/placeholder.png"} alt={trophy.name} fill className="object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold truncate">{trophy.name}</h2>
                      <p className="text-sm text-gray-500 truncate">{trophy.category || "Uncategorized"}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-700 font-medium">₹{trophy.price}</div>
                      <div className="text-xs text-gray-400">{trophy.createdAt ? new Date(trophy.createdAt).toLocaleDateString() : ""}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{trophy.discription || "—"}</p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-2 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        Priority: <strong className="ml-1">{trophy.priority ?? 7}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(trophy)}
                        className="p-2 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white rounded-md"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(trophy)}
                        className="p-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white rounded-md"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</div>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border cursor-pointer rounded disabled:opacity-50">Prev</button>
            <div className="px-3 py-1 border rounded bg-white">Page {page} / {totalPages}</div>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 cursor-pointer py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>

        {/* Delete Modal */}
        {modalOpen === "delete" && deleteTarget && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Delete trophy?</h3>
              <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => { setModalOpen(null); setDeleteTarget(null); }} className="px-4 py-2 cursor-pointer bg-gray-200 rounded">Cancel</button>
                <button disabled={processing} onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white cursor-pointer rounded">{processing ? "Deleting..." : "Delete"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {modalOpen === "edit" && editTarget && (
          <div className="fixed inset-0 bg-black/40 flex items-start md:items-center justify-center z-50 overflow-auto py-8">
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Edit Trophy</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border px-3 py-2 rounded mt-1" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Price</label>
                  <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full border px-3 py-2 rounded mt-1" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full border px-3 py-2 rounded mt-1" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Priority (1 = top)</label>
                  <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })} className="w-full border px-3 py-2 rounded mt-1">
                    {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea rows={4} value={editForm.discription} onChange={(e) => setEditForm({ ...editForm, discription: e.target.value })} className="w-full border px-3 py-2 rounded mt-1 resize-none" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Replace Image (optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setEditForm({ ...editForm, image: e.target.files?.[0] || null })} className="w-full mt-1" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 relative bg-gray-100 rounded overflow-hidden">
                    <Image src={editTarget.image || "/placeholder.png"} alt={editTarget.name} fill className="object-contain" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Created: {editTarget.createdAt ? new Date(editTarget.createdAt).toLocaleDateString() : "-"}</div>
                    <div className="text-sm text-gray-600 mt-1">Current priority: <strong>{editTarget.priority ?? 7}</strong></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setModalOpen(null)} className="px-4 py-2 bg-gray-200 cursor-pointer rounded">Cancel</button>
                <button disabled={processing} onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded">{processing ? "Saving..." : "Save Changes"}</button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
