"use client";

import Link from "next/link";
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

  const deleteExercise = (index: number) => {
    const updated = [...exercises];
    updated.splice(index, 1);
    setExercises(updated);
  };

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
      {/* Dashboard Navbar */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md mb-10 rounded-lg">
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

      <h1 className="text-4xl font-bold mb-8">
        {editing ? "Edit Today's Workout" : "Add Workout for the Day"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {exercises.map((ex, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 bg-zinc-900 p-4 rounded-md items-center shadow"
          >
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
              placeholder="Time (min)"
              value={ex.time}
              onChange={(e) => handleChange(i, "time", e.target.value)}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded"
            />
            <button
              type="button"
              onClick={() => deleteExercise(i)}
              className="text-red-500 hover:text-red-700 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex flex-wrap gap-4 mt-4">
          <button
            type="button"
            onClick={addExercise}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
          >
            ➕ Add Exercise
          </button>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded transition"
          >
            💾 Save Workout
          </button>

          <button
            type="button"
            onClick={() => router.push("/workouts")}
            className="bg-zinc-700 hover:bg-zinc-600 text-sm px-6 py-2 rounded transition"
          >
            ← Back
          </button>
        </div>
      </form>
    </div>
  );
}
