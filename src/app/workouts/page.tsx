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
    <div className="text-white min-h-screen bg-black p-8">
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
          className="bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>

      {/* Content */}
      <div className="flex flex-col gap-4 items-start mt-6">
        <h1 className="text-3xl font-bold">Your Workouts</h1>

        {hasWorkout && (
          <button
            onClick={() => router.push("/workouts/view")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View Your Workout
          </button>
        )}

        <button
          onClick={handleAddRoutineClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Routine
        </button>

        {showOptions && (
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => router.push("/workouts/new-day")}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Workout for the Day
            </button>
            <button
              onClick={() => router.push("/workouts/custom-loop")}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Customized Routine
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
