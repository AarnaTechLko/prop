import jwt from "jsonwebtoken";

// Secret key for JWT (store it in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || "101acers-a-very-secure-password-at-least-32-chars";

// Function to generate a JWT token
export function generateToken(id: number, email: string) {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "1h" });
}

// Function to verify a JWT token
export function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch {
    return null; // Invalid or expired token
  }
}
