'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <h1 className="text-2xl font-bold mb-6">Workout - Day {dayIndex + 1}</h1>
      <button
        onClick={() => router.push("/workouts/custom-loop/view")}
        className="mb-4 bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded"
      >
        ← Back
      </button>

      <table className="table-auto w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-gray-600">
            <th className="px-4 py-2">Exercise</th>
            <th className="px-4 py-2">Sets</th>
            <th className="px-4 py-2">Reps</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Done</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr key={i} className="border-b border-gray-700">
              <td className="px-4 py-2">{ex.exercise}</td>
              <td className="px-4 py-2">{ex.sets}</td>
              <td className="px-4 py-2">{ex.reps}</td>
              <td className="px-4 py-2">{ex.time}</td>
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={ex.checked}
                  onChange={() => handleCheck(i)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
