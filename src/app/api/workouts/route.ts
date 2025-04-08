import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    await connectToDB();
    const saved = await Workout.create({ ...body, userId: user.userId });

    return NextResponse.json(saved);
  } catch (err) {
    console.error("Failed to save workout", err);
    return NextResponse.json({ error: "Failed to save workout" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();
    const workouts = await Workout.find({ type: "day", userId: user.userId });

    return NextResponse.json(workouts);
  } catch (err) {
    return NextResponse.json({ error: "Could not fetch workouts" }, { status: 500 });
  }
}
