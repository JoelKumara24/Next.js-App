'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
  exercise: string;
  sets: string;
  reps: string;
  time: string;
  checked?: boolean;
}

export default function CustomWorkoutDayPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchRoutine = async () => {
      

      try {
        const res = await fetch("/api/routine", {
          credentials: "include", // ✅ sends cookie
        });

        const routine = await res.json(); // ✅ directly use the object


        if (!res.ok || !routine?.days?.length) throw new Error("No routine found");

        const index = routine.currentDayIndex || 0;
        setDayIndex(index);

        const today = routine.days[index].map((ex: Exercise) => ({
          ...ex,
          checked: ex.checked || false,
        }));

        setExercises(today);
      } catch (err) {
        console.error("Failed to load routine from DB", err);
        alert("No routine found");
        router.push("/workouts/custom-loop/view");
      }
    };

    fetchRoutine();
  }, [router]);

  const handleCheck = async (i: number) => {
    const updated = [...exercises];
    updated[i].checked = !updated[i].checked;
    setExercises(updated);

    const allChecked = updated.every(ex => ex.checked);
    if (allChecked) {
      alert("🎉 Workout Complete!");

      try {
        

        await fetch("/api/routine", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅
          body: JSON.stringify({
            updateDay: dayIndex,
            updatedExercises: updated,
          }),
        });

      } catch (err) {
        console.error("Failed to update routine after workout", err);
      }

      router.push("/workouts/custom-loop/view");
    }
  };

  return (
    <div className="text-white bg-black min-h-screen p-10">
      {/* Dashboard Navbar */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md mb-8">
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
  
      {/* Page Title + Back */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">💪 Workout - Day {dayIndex + 1}</h1>
        <button
          onClick={() => router.push("/workouts/custom-loop/view")}
          className="bg-zinc-700 hover:bg-zinc-600 text-sm px-4 py-2 rounded shadow"
        >
          ← Back
        </button>
      </div>
  
      {/* Workout Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 shadow-lg">
        <table className="table-auto w-full text-left">
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
              <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition">
                <td className="px-6 py-4">{ex.exercise}</td>
                <td className="px-6 py-4">{ex.sets}</td>
                <td className="px-6 py-4">{ex.reps}</td>
                <td className="px-6 py-4">{ex.time}</td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={ex.checked}
                    onChange={() => handleCheck(i)}
                    className="w-5 h-5 accent-green-500 hover:cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}
