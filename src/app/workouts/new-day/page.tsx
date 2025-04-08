"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddWorkoutDayPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState([
    { exercise: "", sets: "", reps: "", time: "" },
  ]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchExistingWorkout = async () => {
      try {
        const res = await fetch("/api/workouts", {
          credentials: "include",
        });
        const data = await res.json();
        const latest = data[data.length - 1];
        if (latest?.data?.length) {
          setExercises(latest.data);
          setEditing(true);
        }
      } catch (err) {
        console.error("Failed to fetch existing workout", err);
      }
    };

    fetchExistingWorkout();
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...exercises];
    updated[index][field as keyof typeof updated[0]] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { exercise: "", sets: "", reps: "", time: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const workout = {
      type: "day",
      completed: false,
      data: exercises.map((ex) => ({ ...ex, checked: false })),
    };

    if (editing) {
      // Delete the latest one before re-saving
      await fetch("/api/workouts", {
        method: "DELETE",
        credentials: "include",
      });
    }

    const res = await fetch("/api/workouts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    });

    if (res.ok) {
      router.push("/workouts");
    }
  };

  return (
    <div className="text-white min-h-screen bg-black p-10">
      <h1 className="text-2xl mb-6 font-semibold">
        {editing ? "Edit Today's Workout" : "Add Workout for the Day"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {exercises.map((ex, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            <input
              placeholder="Exercise"
              value={ex.exercise}
              onChange={(e) => handleChange(i, "exercise", e.target.value)}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              placeholder="Sets"
              value={ex.sets}
              onChange={(e) => handleChange(i, "sets", e.target.value)}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              placeholder="Reps"
              value={ex.reps}
              onChange={(e) => handleChange(i, "reps", e.target.value)}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              placeholder="Time"
              value={ex.time}
              onChange={(e) => handleChange(i, "time", e.target.value)}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addExercise}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4"
        >
          Add Exercise
        </button>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-2"
        >
          Save
        </button>
      </form>
    </div>
  );
}
