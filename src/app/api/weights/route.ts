import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Weight from "@/models/Weights"; // ✅ matches the file name


import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();
    const weights = await Weight.find({ userId: user.userId }).sort({ date: 1 });
    return NextResponse.json(weights);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch weights" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDB();

    const newWeight = await Weight.create({ ...body, userId: user.userId });
    return NextResponse.json(newWeight, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save weight" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await connectToDB();
    await Weight.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { id, weight } = await req.json();

  try {
    await connectToDB();
    const updated = await Weight.findByIdAndUpdate(
      id,
      { weight },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
