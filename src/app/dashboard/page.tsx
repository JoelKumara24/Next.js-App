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
      {/* Nav */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md mb-8">
        <div className="flex gap-6 text-lg font-medium">
          <button onClick={() => router.push("/dashboard")} className="hover:text-blue-500">Dashboard</button>
          <button onClick={() => router.push("/workouts")} className="hover:text-blue-500">Workouts</button>
          <button onClick={() => router.push("/weight")} className="hover:text-blue-500">Weight</button>
          <button onClick={() => router.push("/progress")} className="hover:text-blue-500">Progress</button>
          <button onClick={() => router.push("/pbs")} className="hover:text-blue-500">PBs</button>
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
