import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Weight from "@/models/Weights";

// PUT
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { weight } = await req.json();
    await connectToDB();

    const updated = await Weight.findByIdAndUpdate(params.id, { weight }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Weight not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update weight" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    await Weight.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete weight" }, { status: 500 });
  }
}
