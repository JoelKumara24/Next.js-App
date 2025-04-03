import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDB();

    const saved = await Routine.create(body);
    return NextResponse.json(saved);
  } catch (err) {
    console.error("Failed to save routine", err);
    return NextResponse.json({ error: "Failed to save routine" }, { status: 500 });
  }
}

// ✅ GET - Fetch routine
export async function GET() {
    try {
      await connectToDB();
      const routines = await Routine.find();
      return NextResponse.json(routines);
    } catch (err) {
      console.error("Failed to fetch routine", err);
      return NextResponse.json({ error: "Failed to fetch routine" }, { status: 500 });
    }
  }

  // DELETE: Clear all routines
export async function DELETE() {
    try {
      await connectToDB();
      await Routine.deleteMany(); // Later: filter by userId
      return NextResponse.json({ message: "Routine deleted" });
    } catch (err) {
      return NextResponse.json({ error: "Failed to delete routine" }, { status: 500 });
    }
  }
  
