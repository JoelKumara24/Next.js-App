import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import PB from "@/models/PB";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDB();
  const pbs = await PB.find({ userId: user.userId }).sort({ date: -1 });

  return NextResponse.json(pbs);
}

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { exercise, weight, date } = await req.json();

  await connectToDB();
  const saved = await PB.create({ userId: user.userId, exercise, weight, date });

  return NextResponse.json(saved);
}
