import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDB();
  const routine = await Routine.findOne({ userId: user.userId });
  return NextResponse.json(routine);
}

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectToDB();

  await Routine.deleteMany({ userId: user.userId });

  const saved = await Routine.create({ ...body, userId: user.userId });
  return NextResponse.json(saved);
}

export async function DELETE() {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDB();
  await Routine.deleteMany({ userId: user.userId });
  return NextResponse.json({ message: "Routine deleted" });
}

export async function PATCH(req: Request) {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { updateDay, updatedExercises } = await req.json();
  await connectToDB();

  const routine = await Routine.findOne({ userId: user.userId });
  if (!routine) return NextResponse.json({ error: "Not found" }, { status: 404 });

  routine.days[updateDay] = updatedExercises;
  routine.currentDayIndex = (updateDay + 1) % routine.days.length;
  await routine.save();

  return NextResponse.json({ message: "Updated" });
}