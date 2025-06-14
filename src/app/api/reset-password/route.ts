import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

import { RowDataPacket } from "mysql2";

interface PasswordReset extends RowDataPacket {
  id: number;
  email: string;
  token: string;
  expires_at: Date;
  // Add other fields if needed
}

export async function POST(req: Request) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "landos",
    });

    // Check token validity and expiration
   const [rows] = await connection.execute<PasswordReset[]>(
  "SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()",
  [email, token]
);

    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await connection.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    // Delete used token
    await connection.execute(
      "DELETE FROM password_resets WHERE email = ?",
      [email]
    );

    await connection.end();

    return NextResponse.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Error in /api/reset-password:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
