"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard"); // 🎯 successful login
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black text-white">
      
      {/* Home Button Top Right */}
      <Link
        href="/"
        className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 font-semibold text-sm"
      >
        Home
      </Link>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-96">
        <h1 className="text-3xl font-bold">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          className="p-2 rounded bg-zinc-900 border border-zinc-700"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="p-2 rounded bg-zinc-900 border border-zinc-700"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-white text-black py-2 rounded font-semibold" type="submit">
          Login
        </button>

        <p className="mt-2 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline text-blue-400 hover:text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
