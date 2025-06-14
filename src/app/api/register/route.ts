// app/api/register/route.ts
import { db } from "@/db/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";

export const config = {
  runtime: "nodejs",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const mobileStr = formData.get("mobile") as string | null;

    if (!name || !email || !password || !mobileStr) {
      return NextResponse.json(
        { error: "All fields (name, email, password, mobile) are required" },
        { status: 400 }
      );
    }

    const mobile = Number(mobileStr);
    if (isNaN(mobile)) {
      return NextResponse.json(
        { error: "Mobile must be a valid number" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user record
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error in user registration:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.id));
    return NextResponse.json({ success: true, data: allUsers });
  } catch (error) {
    console.error("Drizzle select error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
