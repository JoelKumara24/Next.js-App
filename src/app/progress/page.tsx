"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // make sure this path is correct
import { useRouter } from "next/navigation";

interface ProgressPhoto {
  _id: string;
  url: string;
  type: "front" | "back";
  date: string;
}

export default function ProgressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"front" | "back">("front");
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const router = useRouter();

  // Fetch progress photos on load
  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch("/api/progress", {
        credentials: "include",
      });
      const data = await res.json();
      setPhotos(data);
    };
    fetchPhotos();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const filename = `${Date.now()}_${file.name}`;

    // ✅ Anonymous upload to Supabase (NO credentials needed)
    const { data, error } = await supabase.storage
      .from("progresspics")
      .upload(filename, file); // <- this works on public buckets with no credentials

    if (error) {
      console.error("Upload error:", error.message);
      return alert("Upload failed: " + error.message);
    }

    const publicUrl = supabase.storage
      .from("progresspics")
      .getPublicUrl(filename).data.publicUrl;

    // ✅ Authenticated request to your backend (cookie-based JWT)
    const res = await fetch("/api/progress", {
      method: "POST",
      credentials: "include", // <== only here we send cookies for auth
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: publicUrl,
        type,
        date: new Date().toISOString().split("T")[0],
      }),
    });

    if (!res.ok) {
      console.error("Failed to save progress metadata");
      return alert("Failed to save metadata");
    }

    const saved = await res.json();
    setPhotos((prev) => [...prev, saved]);
    setFile(null);
  };

  const frontPics = photos.filter((p) => p.type === "front");
  const backPics = photos.filter((p) => p.type === "back");

  return (
    <div className="text-white min-h-screen bg-black">
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

      <h1 className="text-3xl font-bold mb-6">Progress Photos</h1>

      {/* Upload section */}
      <div className="flex items-center gap-4 mb-8">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "front" | "back")}
          className="bg-zinc-800 border border-zinc-600 px-4 py-2 rounded"
        >
          <option value="front">Front</option>
          <option value="back">Back</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-white"
        />

        <button
          onClick={handleUpload}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>

      {/* Front Pics */}
      <h2 className="text-2xl font-semibold mb-4">Front Pics</h2>
      <div className="flex gap-4 overflow-x-auto mb-10">
        {frontPics.map((p) => (
          <div key={p._id} className="flex-shrink-0 w-52">
            <img src={p.url} className="rounded-lg w-full h-72 object-cover border" />
            <p className="text-sm mt-2 text-center">{p.date}</p>
          </div>
        ))}
      </div>

      {/* Back Pics */}
      <h2 className="text-2xl font-semibold mb-4">Back Pics</h2>
      <div className="flex gap-4 overflow-x-auto">
        {backPics.map((p) => (
          <div key={p._id} className="flex-shrink-0 w-52">
            <img src={p.url} className="rounded-lg w-full h-72 object-cover border" />
            <p className="text-sm mt-2 text-center">{p.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
