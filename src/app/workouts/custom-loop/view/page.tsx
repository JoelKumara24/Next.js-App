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

  useEffect(() => {
    const saved = localStorage.getItem("workout_week");
    if (saved) {
      const parsed = JSON.parse(saved);
      setRoutine(parsed.days || []);
      setDayIndex(parsed.currentDayIndex || 0);
    }
  }, []);

  const handleStartWorkout = () => {
    router.push("/workouts/custom-loop/day");
  };

  const handleEdit = () => {
    router.push(`/workouts/custom-loop/setup?days=${routine.length}`);
  };

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
      <p className="mb-4 text-lg">Today is <span className="font-semibold">Day {dayIndex + 1}</span></p>

      <div className="flex gap-4">
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
      onClick={() => router.push("/workouts")}
      className="mb-4 bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded"
    >
      ← Back
    </button>
    </div>
  );
}
