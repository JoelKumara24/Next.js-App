'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
  exercise: string;
  sets: string;
  reps: string;
  time: string;
  done: boolean;
  checked?: boolean;
}

export default function ViewWorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [hasWorkout, setHasWorkout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await fetch("/api/workouts", {
          credentials: "include",
        });

        const data = await res.json();
        const latest = data[data.length - 1];

        if (latest?.data?.length) {
          setExercises(latest.data);
          setHasWorkout(true);
        } else {
          setHasWorkout(false);
        }
      } catch (err) {
        console.error("Failed to fetch workout", err);
        setHasWorkout(false);
      }
    };

    fetchWorkout();
  }, []);

  const handleCheckboxChange = (index: number) => {
    const updated = [...exercises];
    updated[index].checked = !updated[index].checked;
    setExercises(updated);

    const allChecked = updated.every((e) => e.checked);
    if (allChecked) {
      alert("🎉 Congrats! You completed your workout!");
      router.push("/workouts");
    }
  };

  const handleEditOrAdd = () => {
    router.push("/workouts/new-day");
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
  
      <h1 className="text-4xl font-bold mb-8">🔥 Today's Workout</h1>
  
      {exercises.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 shadow-lg mb-10">
          <table className="w-full table-auto text-left">
            <thead className="bg-zinc-900 text-gray-400 uppercase text-sm">
              <tr>
                <th className="px-6 py-3">Exercise</th>
                <th className="px-6 py-3">Sets</th>
                <th className="px-6 py-3">Reps</th>
                <th className="px-6 py-3">Time (min)</th>
                <th className="px-6 py-3 text-center">Done</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex, i) => (
                <tr
                  key={i}
                  className="border-t border-zinc-800 hover:bg-zinc-800/50 transition"
                >
                  <td className="px-6 py-4">{ex.exercise}</td>
                  <td className="px-6 py-4">{ex.sets}</td>
                  <td className="px-6 py-4">{ex.reps}</td>
                  <td className="px-6 py-4">{ex.time}</td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={ex.checked}
                      onChange={() => handleCheckboxChange(i)}
                      className="w-5 h-5 accent-green-500 hover:cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-lg mb-8">No workout added for today.</p>
      )}
  
      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleEditOrAdd}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm rounded shadow"
        >
          {hasWorkout ? "Edit Workout" : "Add Workout"}
        </button>
        <button
          onClick={() => router.push("/workouts")}
          className="bg-zinc-700 hover:bg-zinc-600 text-sm px-6 py-2 rounded shadow"
        >
          ← Back
        </button>
      </div>
    </div>
  );
  
}
