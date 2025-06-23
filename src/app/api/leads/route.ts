// app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm"; // ✅ important import

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID missing" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(leads)
      .where(eq(leads.user_id, Number(userId))); // ✅ correct usage of eq

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
