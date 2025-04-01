'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Fitness Tracker</h1>
        <Link href="/login">
          <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300 transition">
            Go to Login
          </button>
        </Link>
      </div>
    </main>
  );
}
