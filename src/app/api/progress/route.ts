// app/api/progress/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import ProgressPhoto from "@/models/ProgressPhotos";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDB();
    const photos = await ProgressPhoto.find({ userId: user.userId }).sort({
      date: 1,
    });

    return NextResponse.json(photos);
  } catch (err) {
    console.error("Failed to fetch progress photos", err);
    return NextResponse.json(
      { error: "Could not fetch progress photos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { url, type, date } = await req.json();
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDB();

  const saved = await ProgressPhoto.create({
    userId: user.userId,
    url,
    type,
    date,
  });

  return NextResponse.json(saved);
}