"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Exercise {
  exercise: string;
  sets: string;
  reps: string;
  time: string;
}

export default function CustomLoopSetupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const days = parseInt(searchParams.get("days") || "0");
  const isEdit = searchParams.get("edit") === "true";

  const [routine, setRoutine] = useState<Exercise[][]>([]);

  useEffect(() => {
    const initializeRoutine = async () => {
      

      try {
        const res = await fetch("/api/routine", {
          credentials: "include",
        });

        const existingRoutine = await res.json();


        if (res.ok && existingRoutine?.days?.length) {
          if (isEdit) {
            setRoutine(existingRoutine.days);
            return;
          }

          const confirmEdit = window.confirm(
            "You already have a saved routine. Do you want to edit it?\nClick Cancel to delete and create a new one."
          );

          if (confirmEdit) {
            setRoutine(existingRoutine.days);
            return;
          } else {
            await fetch("/api/routine", {
              method: "DELETE",
              credentials: "include",
            });
          }
        }

        // No existing routine or just deleted → create blank
        if (days > 0) {
          const newRoutine: Exercise[][] = Array.from({ length: days }, () => []);
          setRoutine(newRoutine);
        }
      } catch (err) {
        console.error("Routine fetch/setup error", err);
      }
    };

    initializeRoutine();
  }, [days, isEdit]);

  const handleChange = (
    dayIndex: number,
    exIndex: number,
    field: keyof Exercise,
    value: string
  ) => {
    const updated = [...routine];
    updated[dayIndex][exIndex][field] = value;
    setRoutine(updated);
  };

  const addExercise = (dayIndex: number) => {
    const updated = [...routine];
    updated[dayIndex].push({ exercise: "", sets: "", reps: "", time: "" });
    setRoutine(updated);
  };

  const deleteExercise = (dayIndex: number, exIndex: number) => {
    const updated = [...routine];
    updated[dayIndex].splice(exIndex, 1);
    setRoutine(updated);
  };
  

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not logged in");

    const fullRoutine = {
      days: routine,
      currentDayIndex: 0,
    };

    const res = await fetch("/api/routine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(fullRoutine),
    });

    if (res.ok) {
      router.push("/workouts/custom-loop/view");
    } else {
      alert("Error saving routine");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Setup Your Custom Routine ({days} Days)
      </h1>
  
      <div className="space-y-12 max-w-5xl mx-auto">
        {routine.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="bg-zinc-900 p-6 rounded-2xl shadow-md border border-zinc-700"
          >
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">
              Day {dayIndex + 1}
            </h2>
  
            {day.map((ex, exIndex) => (
              <div
                key={exIndex}
                className="grid grid-cols-5 gap-4 mb-4 items-center"
              >
                <input
                  className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Exercise"
                  value={ex.exercise}
                  onChange={(e) =>
                    handleChange(dayIndex, exIndex, "exercise", e.target.value)
                  }
                />
                <input
                  className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg w-full focus:outline-none"
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) =>
                    handleChange(dayIndex, exIndex, "sets", e.target.value)
                  }
                />
                <input
                  className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg w-full focus:outline-none"
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) =>
                    handleChange(dayIndex, exIndex, "reps", e.target.value)
                  }
                />
                <input
                  className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg w-full focus:outline-none"
                  placeholder="Time (mins)"
                  value={ex.time}
                  onChange={(e) =>
                    handleChange(dayIndex, exIndex, "time", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => deleteExercise(dayIndex, exIndex)}
                  className="text-red-500 hover:text-red-700 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
  
            <button
              onClick={() => addExercise(dayIndex)}
              className="mt-4 text-sm bg-zinc-700 hover:bg-zinc-600 px-5 py-2 rounded-md shadow transition"
            >
              ➕ Add Exercise
            </button>
          </div>
        ))}
  
        {/* Action buttons */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-md shadow-lg text-lg font-semibold transition"
          >
            ✅ Save Routine
          </button>
          <button
            onClick={() => router.push("/workouts/custom-loop/view")}
            className="bg-zinc-700 hover:bg-zinc-600 px-8 py-3 rounded-md text-lg transition"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
  
}
