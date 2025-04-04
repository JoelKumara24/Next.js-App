// src/lib/auth.ts
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (err) {
    console.error("Invalid token:", err); // <-- Add this!
    return null;
  }
}
