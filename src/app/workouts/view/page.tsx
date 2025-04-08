'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <h1 className="text-3xl mb-6 font-bold">Today's Workout</h1>

      {exercises.length > 0 ? (
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
                    onChange={() => handleCheckboxChange(i)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No workout added for today.</p>
      )}

      <button
        onClick={handleEditOrAdd}
        className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        {hasWorkout ? "Edit Workout" : "Add Workout"}
      </button>
    </div>
  );
}
