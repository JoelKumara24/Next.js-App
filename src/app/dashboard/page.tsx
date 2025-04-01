"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    <div className="text-white text-2xl p-10 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="text-green-500" />
        Dashboard Protected Page
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-2 w-fit text-base rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
