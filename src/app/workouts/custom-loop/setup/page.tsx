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
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Setup Your Custom Routine ({days} Days)
      </h1>
      <div className="space-y-8">
        {routine.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-zinc-900 p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Day {dayIndex + 1}</h2>
            {day.map((ex, exIndex) => (
              <div key={exIndex} className="grid grid-cols-4 gap-2 mb-2">
                <input
                  className="p-2 bg-zinc-800 border border-zinc-700 rounded"
                  placeholder="Exercise"
                  value={ex.exercise}
                  onChange={(e) =>
                    handleChange(dayIndex, exIndex, "exercise", e.target.value)
                  }
                />
                <input
                  className="p-2 bg-zinc-800 border border-zinc-700 rounded"
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) =>
                    handleChange(dayIndex, exIndex, "sets", e.target.value)
                  }
                />
                <input
                  className="p-2 bg-zinc-800 border border-zinc-700 rounded"
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) =>
                    handleChange(dayIndex, exIndex, "reps", e.target.value)
                  }
                />
                <input
                  className="p-2 bg-zinc-800 border border-zinc-700 rounded"
                  placeholder="Time"
                  value={ex.time}
                  onChange={(e) =>
                    handleChange(dayIndex, exIndex, "time", e.target.value)
                  }
                />
                 <button
      type="button"
      onClick={() => deleteExercise(dayIndex, exIndex)}
      className="text-red-500 hover:text-red-700 text-sm"
    >
      ✕
    </button>
              </div>
            ))}
            <button
              onClick={() => addExercise(dayIndex)}
              className="bg-gray-700 hover:bg-gray-600 text-sm px-4 py-1 rounded mt-2"
            >
              Add Exercise
            </button>
          </div>
        ))}

        <button
          onClick={handleSave}
          className="mt-8 bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
        >
          Save Routine
        </button>
        <button
          onClick={() => router.push("/workouts/custom-loop/view")}
          className="mb-4 bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
