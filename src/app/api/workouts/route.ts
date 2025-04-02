import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectToDB();
    const saved = await Workout.create(body);

    return NextResponse.json(saved);
  } catch (err) {
    console.error("Failed to save workout", err);
    return NextResponse.json({ error: "Failed to save workout" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const workouts = await Workout.find({ type: "day" });

    return NextResponse.json(workouts);
  } catch (err) {
    return NextResponse.json({ error: "Could not fetch workouts" }, { status: 500 });
  }
}