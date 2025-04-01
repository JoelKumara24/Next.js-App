import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // instantly expire the cookie
  });

  return NextResponse.json({ message: "Logged out" });
}
