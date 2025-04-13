import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Weight from "@/models/Weights";

export async function PUT(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  try {
    const id = context.params.id;
    const { weight } = await req.json();

    await connectToDB();
    const updated = await Weight.findByIdAndUpdate(id, { weight }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Weight not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update weight" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  try {
    const id = context.params.id;
    await connectToDB();
    await Weight.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete weight" }, { status: 500 });
  }
}
