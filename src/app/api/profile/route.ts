import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET: Fetch user profile
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    const id = Number(userId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user[0]); // Directly return user with plain text address
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Update user profile
export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    const id = Number(userId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const body = await req.json();

    await db
      .update(users)
      .set({
        name: body.name,
        mobile: body.mobile,
        address: body.address || "", // Save plain text directly
      })
      .where(eq(users.id, id));

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
