import { NextRequest, NextResponse } from "next/server";
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

// PUT update by ID (pass ID as a query param)
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const { weight } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    await connectToDB();
    const updated = await Weight.findByIdAndUpdate(id, { weight }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Weight not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update weight" }, { status: 500 });
  }
}

// DELETE by ID (pass ID as a query param)
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    await connectToDB();
    await Weight.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete weight" }, { status: 500 });
  }
}
