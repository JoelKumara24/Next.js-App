// src/lib/auth.ts
import jwt from "jsonwebtoken";

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // contains userId, email, etc.
  } catch (err) {
    return null;
  }
}
