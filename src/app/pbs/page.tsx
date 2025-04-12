"use client";

import { useRouter } from "next/navigation"; // ✅ CORRECT HOOK
import { useEffect, useState } from "react";

interface PB {
  _id: string;
  exercise: string;
  weight: number;
  date: string;
}

export default function PBsPage() {
  const router = useRouter(); // ✅ Hook usage goes inside function

  const [pbs, setPBs] = useState<PB[]>([]);
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("/api/pbs", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setPBs(data));
  }, []);

  const handleAdd = async () => {
    if (!exercise || !weight || !date) return alert("Please fill all fields");

    const res = await fetch("/api/pbs", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise, weight: Number(weight), date }),
    });

    const saved = await res.json();
    setPBs((prev) => [saved, ...prev]);
    setExercise("");
    setWeight("");
    setDate("");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md mb-8">
        <div className="flex gap-6 text-lg font-medium">
          <button onClick={() => router.push("/dashboard")} className="hover:text-blue-500">Dashboard</button>
          <button onClick={() => router.push("/workouts")} className="hover:text-blue-500">Workouts</button>
          <button onClick={() => router.push("/weight")} className="hover:text-blue-500">Weight</button>
          <button onClick={() => router.push("/progress")} className="hover:text-blue-500">Progress</button>
          <button onClick={() => router.push("/pbs")} className="hover:text-blue-500">PBs</button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>

      <h1 className="text-3xl font-bold mb-6">Personal Bests</h1>

      {/* Form */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Exercise"
          className="bg-zinc-800 px-4 py-2 rounded"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          className="bg-zinc-800 px-4 py-2 rounded"
          value={weight}
          onChange={(e) => setWeight(e.target.value === "" ? "" : +e.target.value)}
        />
        <input
          type="date"
          className="bg-zinc-800 px-4 py-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {/* PB list */}
      <table className="w-full border border-zinc-700 text-left">
        <thead>
          <tr className="bg-zinc-800">
            <th className="px-4 py-2">Exercise</th>
            <th className="px-4 py-2">Weight</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {pbs.map((pb) => (
            <tr key={pb._id} className="border-t border-zinc-700">
              <td className="px-4 py-2">{pb.exercise}</td>
              <td className="px-4 py-2">{pb.weight} kg</td>
              <td className="px-4 py-2">{pb.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
