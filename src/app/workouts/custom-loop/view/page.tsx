"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Your Custom Routine</h1>
      <p className="mb-4 text-lg">
        Today is <span className="font-semibold">Day {dayIndex + 1}</span>
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleStartWorkout}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Start Today's Workout
        </button>
        <button
          onClick={handleEdit}
          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
        >
          Edit Routine
        </button>
      </div>

      <button
  onClick={handleDelete}
  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
>
  Delete Routine
</button>

      <button
        onClick={() => router.push("/workouts")}
        className="bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded"
      >
        ← Back
      </button>
    </div>
  );
}
