"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function WorkoutsPage() {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [hasWorkout, setHasWorkout] = useState(false);

  useEffect(() => {
    const checkWorkout = async () => {
      try {
        const res = await fetch("/api/workouts");
        const data = await res.json();
        setHasWorkout(data.length > 0);
      } catch (err) {
        console.error("Failed to check workouts", err);
      }
    };
  
    checkWorkout();
  }, []);
  

  const handleAddRoutineClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="text-white min-h-screen bg-black">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md">
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
          className="bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </nav>
  
      {/* Content */}
      <main className="p-10">
        <h1 className="text-4xl font-bold mb-8">Your Workouts</h1>
  
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => router.push("/workouts/view")}
            className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg text-lg font-medium"
          >
            ✅ View Today's Workout
          </button>
  
          <button
            onClick={() => router.push("/workouts/custom-loop")}
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-lg font-medium"
          >
            🔁 View Custom Routine
          </button>
        </div>
      </main>
    </div>
  );
  
}
