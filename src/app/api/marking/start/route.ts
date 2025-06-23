import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { leadtype } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/* export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listId } = body;
    const userId = req.headers.get("x-user-id");

    if (!listId || !userId) {
      return NextResponse.json({ success: false, message: "Missing listId or userId" }, { status: 400 });
    }

    await db.insert(leadtype).values({
      lead_list_id: Number(listId),
      user_id: Number(userId),
    });

    return NextResponse.json({ success: true, message: "Marketing campaign created" });
  } catch (error) {
    console.error("Marketing API error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
} */

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const lists = await db
      .select()
      .from(leadtype)
      .where(
        and(eq(leadtype.user_id, Number(userId)), eq(leadtype.status, 1))
      );

    return NextResponse.json({ success: true, data: lists });
  } catch (error) {
    console.error("Lead List GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch lead lists" }, { status: 500 });
  }
}
