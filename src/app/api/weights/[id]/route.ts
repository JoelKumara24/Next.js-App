import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Weight from "@/models/Weights";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { weight } = await req.json();

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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await connectToDB();
    await Weight.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete weight" }, { status: 500 });
  }
}
