'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  time: string;
  done: boolean;
}

export default function ViewWorkoutPage() {
    const [exercises, setExercises] = useState<any[]>([]);
    const router = useRouter();
  
    useEffect(() => {
        const fetchWorkout = async () => {
          try {
            const res = await fetch("/api/workouts");
            const data = await res.json();
            const latest = data[data.length - 1]; // get latest workout
            setExercises(latest?.data || []);
          } catch (err) {
            console.error("Failed to fetch workout", err);
          }
        };
      
        fetchWorkout();
      }, []);
      
  
    const handleCheckboxChange = (index: number) => {
      const updated = [...exercises];
      updated[index].checked = !updated[index].checked;
      setExercises(updated);
  
      // Save updated workout back to localStorage
      //const stored = localStorage.getItem("workout_day");
     // if (stored) {
     //   const parsed = JSON.parse(stored);
     //   parsed.data = updated;
     //   localStorage.setItem("workout_day", JSON.stringify(parsed));
     // }
  
      const allChecked = updated.every((e) => e.checked);
      if (allChecked) {
        alert("🎉 Congrats! You completed your workout!");
        router.push("/workouts");
      }
    };
  
    return (
      <div className="text-white min-h-screen bg-black p-10">
        <h1 className="text-3xl mb-6 font-bold">Today's Workout</h1>
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
      </div>
    );
  }
