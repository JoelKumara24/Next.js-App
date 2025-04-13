"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Dumbbell, Image, LineChart, Star } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/verify");
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md mb-8">
        <div className="flex gap-6 text-lg font-medium">
          <button onClick={() => router.push("/dashboard")} className="hover:text-blue-500">Dashboard</button>
          <button onClick={() => router.push("/workouts")} className="hover:text-blue-500">Workouts</button>
          <button onClick={() => router.push("/weight")} className="hover:text-blue-500">Weight</button>
          <button onClick={() => router.push("/progress")} className="hover:text-blue-500">Progress</button>
          <button onClick={() => router.push("/pbs")} className="hover:text-blue-500">PBs</button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="px-10 pb-20">
        {/* Welcome */}
        <div className="text-3xl font-bold flex items-center gap-3 mb-10">
          <CheckCircle className="text-green-500" />
          Welcome to your Fitness Dashboard
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Link href="/workouts/view">
            <div className="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-lg shadow-md cursor-pointer transition-all">
              <Dumbbell className="text-blue-400 mb-4" size={28} />
              <h2 className="text-lg font-semibold">Today's Workout</h2>
              <p className="text-sm text-gray-400">View or complete your workout</p>
            </div>
          </Link>

          <Link href="/weight">
            <div className="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-lg shadow-md cursor-pointer transition-all">
              <LineChart className="text-yellow-400 mb-4" size={28} />
              <h2 className="text-lg font-semibold">Weight Tracker</h2>
              <p className="text-sm text-gray-400">Log and view your weight progress</p>
            </div>
          </Link>

          <Link href="/progress">
            <div className="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-lg shadow-md cursor-pointer transition-all">
              <Image className="text-pink-400 mb-4" size={28} />
              <h2 className="text-lg font-semibold">Progress Photos</h2>
              <p className="text-sm text-gray-400">Track physical progress visually</p>
            </div>
          </Link>

          <Link href="/pbs">
            <div className="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-lg shadow-md cursor-pointer transition-all">
              <Star className="text-purple-400 mb-4" size={28} />
              <h2 className="text-lg font-semibold">Personal Bests</h2>
              <p className="text-sm text-gray-400">View your best lifts</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
