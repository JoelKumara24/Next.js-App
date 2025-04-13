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

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/progress?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  
    if (res.ok) {
      setPhotos((prev) => prev.filter((photo) => photo._id !== id));
    } else {
      alert("Failed to delete photo.");
    }
  };
  

  const frontPics = photos.filter((p) => p.type === "front");
  const backPics = photos.filter((p) => p.type === "back");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  return (
    <div className="text-white min-h-screen bg-gradient-to-b from-black to-zinc-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-zinc-900 px-6 py-4 shadow-md">
        <div className="flex gap-6 text-lg font-medium">
          <button onClick={() => router.push("/dashboard")} className="hover:text-blue-500">Dashboard</button>
          <button onClick={() => router.push("/workouts")} className="hover:text-blue-500">Workouts</button>
          <button onClick={() => router.push("/weight")} className="hover:text-blue-500">Weight</button>
          <button onClick={() => router.push("/progress")} className="hover:text-blue-500 text-blue-400">Progress</button>
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
  
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Progress Photos</h1>
  
       {/* Upload */}
<div className="flex flex-col items-center gap-4 mb-10">
  <div className="flex gap-4 flex-wrap justify-center items-center">

    {/* Select Type */}
    <select
      value={type}
      onChange={(e) => setType(e.target.value as "front" | "back")}
      className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-md text-white shadow-sm hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="front">Front</option>
      <option value="back">Back</option>
    </select>

    {/* File Input */}
    <label className="relative cursor-pointer bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-md shadow-sm hover:border-blue-500 transition">
      <span>Choose File</span>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </label>

    {/* Upload Button */}
    <button
      onClick={handleUpload}
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-2 rounded-md font-semibold text-white shadow-lg transition-all duration-200"
    >
      Upload
    </button>
  </div>

  {/* Show selected file name */}
  {file && (
    <p className="text-sm text-gray-400 mt-2">
      Selected: <span className="text-white font-medium">{file.name}</span>
    </p>
  )}
</div>

  
        {/* Front Pics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-zinc-700 pb-2">Front Pics</h2>
          {frontPics.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto">
              {frontPics.map((p) => (
                <div key={p._id} className="flex-shrink-0 w-52 relative group bg-zinc-800 rounded-lg shadow hover:scale-105 transition">
                  <img
  src={p.url}
  alt="Front Progress"
  onClick={() => setPreviewUrl(p.url)}
  className="cursor-pointer rounded-t-lg w-full h-72 object-cover border-b border-zinc-700 hover:opacity-90"
/>

                  <div className="p-2 text-center text-sm">{p.date}</div>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No front progress photos uploaded yet.</p>
          )}
        </section>
  
        {/* Back Pics */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b border-zinc-700 pb-2">Back Pics</h2>
          {backPics.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto">
              {backPics.map((p) => (
                <div key={p._id} className="flex-shrink-0 w-52 relative group bg-zinc-800 rounded-lg shadow hover:scale-105 transition">
                  <img
  src={p.url}
  alt="Back Progress"
  onClick={() => setPreviewUrl(p.url)}
  className="cursor-pointer rounded-t-lg w-full h-72 object-cover border-b border-zinc-700 hover:opacity-90"
/>

                  <div className="p-2 text-center text-sm">{p.date}</div>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No back progress photos uploaded yet.</p>
          )}
        </section>

        {/* Fullscreen Image Modal */}
{previewUrl && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div className="relative max-w-4xl w-full h-full flex items-center justify-center px-4">
      <img
        src={previewUrl}
        alt="Preview"
        className="max-h-[90%] max-w-[90%] object-contain rounded shadow-lg"
      />
      <button
        onClick={() => setPreviewUrl(null)}
        className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
      >
        ✕ Close
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
  
}
