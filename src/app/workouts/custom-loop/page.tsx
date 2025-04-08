"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomLoopEntryPage() {
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await fetch("/api/routine", {
          credentials: "include",
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data?.days?.length > 0) {
          // ✅ Routine exists – redirect to view
          router.push("/workouts/custom-loop/view");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Routine fetch error:", err);
        setLoading(false);
      }
    };

    fetchRoutine();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (days <= 0) return;

    router.push(`/workouts/custom-loop/setup?days=${days}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Checking your routine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl shadow-lg flex flex-col gap-6 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center">No Routine Found</h1>
        <label className="text-sm text-gray-300 text-center">
          Create a custom routine to view it.
        </label>
        <input
          type="number"
          min={1}
          max={14}
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="p-2 rounded bg-zinc-800 border border-zinc-700"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Routine
        </button>
      </form>
    </div>
  );
}
