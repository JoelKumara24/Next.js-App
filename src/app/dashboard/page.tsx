'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

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
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/login");
  };

  if (loading) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md">
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/workouts" className="hover:text-blue-400">Workouts</Link>
          <Link href="/weight" className="hover:text-blue-400">Weight</Link>
          <Link href="/progress" className="hover:text-blue-400">Progress</Link>
          <Link href="/pbs" className="hover:text-blue-400">PBs</Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="text-white text-2xl p-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500" />
          Dashboard Protected Page
        </div>
      </main>
    </div>
  );
}
