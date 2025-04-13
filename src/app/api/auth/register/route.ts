import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (err: any) {
    console.error("Registration Error:", err);
  
    // Duplicate key error
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyPattern)[0];
      return NextResponse.json(
        { error: `${duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)} already exists` },
        { status: 400 }
      );
    }
  
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
}
