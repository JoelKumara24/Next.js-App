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
    const stored = localStorage.getItem("workout_week");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const index = parsed.currentDayIndex || 0;
        setDayIndex(index);
        const today = parsed.days[index].map((ex: Exercise) => ({
          ...ex,
          checked: ex.checked || false,
        }));
        setExercises(today);
      } catch (err) {
        console.error("Failed to parse workout_week");
      }
    }
  }, []);

  const handleCheck = (i: number) => {
    const updated = [...exercises];
    updated[i].checked = !updated[i].checked;
    setExercises(updated);

    const allChecked = updated.every(ex => ex.checked);
    if (allChecked) {
      alert("🎉 Workout Complete!");
      
      // Update localStorage
      const stored = localStorage.getItem("workout_week");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.days[dayIndex] = updated;
        parsed.currentDayIndex = (dayIndex + 1) % parsed.days.length; // loop back if end
        localStorage.setItem("workout_week", JSON.stringify(parsed));
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
