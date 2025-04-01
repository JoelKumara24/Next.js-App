import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); // 👈 Fix here
  const token = cookieStore.get("token")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Authorized", user });
}
