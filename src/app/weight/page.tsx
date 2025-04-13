"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ...imports remain the same
interface WeightEntry {
  _id?: string; // assuming from DB
  date: string;
  weight: number;
}

export default function WeightsPage() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [weight, setWeight] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "graph">("table");
  const router = useRouter();

  useEffect(() => {
    const fetchWeights = async () => {
      const res = await fetch("/api/weights", { credentials: "include" });
      const data = await res.json();
      setWeights(data);
    };
    fetchWeights();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    if (editingId) {
      const res = await fetch(`/api/weights/${editingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight }),
      });
      if (res.ok) {
        const updated = await res.json();
        setWeights((prev) =>
          prev.map((w) => (w._id === editingId ? updated : w))
        );
        setEditingId(null);
        setWeight(0);
      }
    } else {
      const res = await fetch("/api/weights", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, weight }),
      });
      const saved = await res.json();
      setWeights((prev) => [...prev, saved]);
      setWeight(0);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/weights/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setWeights((prev) => prev.filter((w) => w._id !== id));
  };

  const startEdit = (entry: WeightEntry) => {
    setEditingId(entry._id || null);
    setWeight(entry.weight);
  };

  return (
    <div className="text-white min-h-screen bg-black">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md mb-8">
        <div className="flex gap-6 text-lg font-medium">
          <Link href="/dashboard" className="hover:text-blue-500">Dashboard</Link>
          <Link href="/workouts" className="hover:text-blue-500">Workouts</Link>
          <Link href="/weight" className="hover:text-blue-500">Weight</Link>
          <Link href="/progress" className="hover:text-blue-500">Progress</Link>
          <Link href="/pbs" className="hover:text-blue-500">PBs</Link>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
          }}
          className="bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>

      <div className="px-10">
        <h1 className="text-3xl font-bold mb-6">Track Your Weight</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-6">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded"
            placeholder="Enter weight"
          />
          <button type="submit" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
            {editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setWeight(0);
              }}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Toggle View */}
        <div className="mb-6">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 mr-2 rounded ${viewMode === "table" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className={`px-4 py-2 rounded ${viewMode === "graph" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Graph View
          </button>
        </div>

        {/* Views */}
        {viewMode === "table" ? (
          <table className="w-full border border-zinc-800 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-zinc-900 text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {weights.map((w) => (
              <tr
                key={w._id}
                className="hover:bg-zinc-800 transition duration-150 ease-in-out border-b border-zinc-800"
              >
                <td className="px-6 py-4">{w.date}</td>
                <td className="px-6 py-4 font-semibold text-white">{w.weight} kg</td>
                <td className="px-6 py-4 flex gap-4">
                  <button
                    onClick={() => startEdit(w)}
                    className="text-blue-400 hover:text-blue-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w._id!)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weights}>
              <Line type="monotone" dataKey="weight" stroke="#00FFAA" />
              <CartesianGrid stroke="#555" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
