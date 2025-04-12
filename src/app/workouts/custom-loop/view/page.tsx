"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Exercise {
  exercise: string;
  sets: string;
  reps: string;
  time: string;
  checked?: boolean;
}

export default function ViewCustomRoutinePage() {
  const router = useRouter();
  const [routine, setRoutine] = useState<Exercise[][]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutine = async () => {
      

      try {
        const res = await fetch("/api/routine", {
          credentials: "include",
        });
        

        if (!res.ok) throw new Error("Failed to fetch routine");

        const userRoutine = await res.json();

if (userRoutine?.days?.length) {
  setRoutine(userRoutine.days);
  setDayIndex(userRoutine.currentDayIndex || 0);
}

      } catch (err) {
        console.error("Error loading routine:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, []);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this routine?");
    if (!confirmed) return;
  
    try {
      const res = await fetch("/api/routine", {
        method: "DELETE",
        credentials: "include",
      });
  
      if (res.ok) {
        alert("Routine deleted.");
        router.push("/workouts"); // or go to the setup page instead
      } else {
        alert("Failed to delete routine");
      }
    } catch (err) {
      console.error("Failed to delete routine", err);
      alert("Something went wrong.");
    }
  };
  

  const handleStartWorkout = () => {
    router.push("/workouts/custom-loop/day");
  };

  const handleEdit = () => {
    router.push(`/workouts/custom-loop/setup?days=${routine.length}&edit=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!routine.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>No custom routine found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-zinc-900 px-8 py-4 shadow-md">
        <div className="flex gap-8 text-lg font-medium">
          <Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
          <Link href="/workouts" className="hover:text-blue-400 transition">Workouts</Link>
          <Link href="/weight" className="hover:text-blue-400 transition">Weight</Link>
          <Link href="/progress" className="hover:text-blue-400 transition">Progress</Link>
          <Link href="/pbs" className="hover:text-blue-400 transition">PBs</Link>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
          }}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md text-sm font-medium transition"
        >
          Logout
        </button>
      </nav>
  
      {/* Content */}
      <main className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-4">Your Custom Routine</h1>
        <p className="text-xl text-gray-300 mb-10">
          Today is <span className="text-white font-semibold">Day {dayIndex + 1}</span>
        </p>
  
        {/* Buttons Row */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={handleStartWorkout}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md shadow hover:shadow-lg transition text-lg font-semibold"
          >
            Start Today&apos;s Workout
          </button>
          <button
            onClick={handleEdit}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-md shadow hover:shadow-lg transition text-lg font-semibold text-black"
          >
            Edit Routine
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md shadow hover:shadow-lg transition text-lg font-semibold"
          >
            Delete Routine
          </button>
          <button
            onClick={() => router.push("/workouts")}
            className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-md shadow hover:shadow-lg transition text-lg font-medium"
          >
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
  
}
