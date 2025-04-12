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

interface WeightEntry {
  date: string;
  weight: number;
}

export default function WeightsPage() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [weight, setWeight] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "graph">("table");
  const router = useRouter();

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const res = await fetch("/api/weights", {
          credentials: "include",
        });
        const data = await res.json();
        setWeights(data);
      } catch (err) {
        console.error("Failed to fetch weights", err);
      }
    };

    fetchWeights();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entry = {
      date: new Date().toISOString().split("T")[0],
      weight,
    };

    const res = await fetch("/api/weights", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    if (res.ok) {
      setWeights((prev) => [...prev, entry]);
      setWeight(0);
    }
  };

  return (
    <div className="text-white min-h-screen bg-black">
      {/* Dashboard Navbar */}
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

      <h1 className="text-3xl font-bold mb-6">Track Your Weight</h1>

      {/* Add Weight Form */}
      <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-6">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
          className="p-2 bg-zinc-800 border border-zinc-700 rounded"
          placeholder="Enter your weight"
        />
        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
      </form>

      {/* Toggle View Mode */}
      <div className="mb-6">
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-2 mr-2 rounded ${
            viewMode === "table" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode("graph")}
          className={`px-4 py-2 rounded ${
            viewMode === "graph" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Graph View
        </button>
      </div>

      {/* Table or Graph View */}
      {viewMode === "table" ? (
        <table className="table-auto w-full text-left">
          <thead className="text-gray-400">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Weight</th>
            </tr>
          </thead>
          <tbody>
            {weights.map((w, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td className="px-4 py-2">{w.date}</td>
                <td className="px-4 py-2">{w.weight} kg</td>
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
  );
}
