import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Weight from "@/models/Weights";

// Fix: Use explicit 'RouteHandlerContext' type or inline fallback
interface RouteContext {
  params: {
    id: string;
  };
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { weight } = await req.json();
    await connectToDB();

    const updated = await Weight.findByIdAndUpdate(context.params.id, { weight }, { new: true });

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
  context: RouteContext
) {
  try {
    await connectToDB();
    await Weight.findByIdAndDelete(context.params.id);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete weight" }, { status: 500 });
  }
}
