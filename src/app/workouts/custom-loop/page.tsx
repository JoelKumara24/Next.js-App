"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomLoopEntryPage() {
  const [days, setDays] = useState(3);
  const [hasRoutine, setHasRoutine] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const existing = localStorage.getItem("workout_week");
    setHasRoutine(!!existing);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (days > 0) {
      if (hasRoutine) {
        const confirmEdit = window.confirm(
          "A routine already exists. Do you want to EDIT it instead?\n\nClick OK to edit, or Cancel to create a new one."
        );

        if (confirmEdit) {
          // Go to edit with special flag
          router.push("/workouts/custom-loop/setup?edit=true");
        } else {
          // Clear and create new
          localStorage.removeItem("workout_week");
          router.push(`/workouts/custom-loop/setup?days=${days}`);
        }
      } else {
        // No existing routine
        router.push(`/workouts/custom-loop/setup?days=${days}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl shadow-lg flex flex-col gap-6 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center">Custom Workout Loop</h1>
        <label className="text-sm text-gray-300">
          How many days in your loop?
        </label>
        <input
          type="number"
          min={1}
          max={14}
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="p-2 rounded bg-zinc-800 border border-zinc-700"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {hasRoutine ? "Edit or Create New" : "Next"}
        </button>
      </form>
    </div>
  );
}
