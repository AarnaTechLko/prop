import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { leadtype, leads } from "@/db/schema";
import { and, count, desc, eq } from "drizzle-orm";

// Create Lead Type
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, status } = body;
    const userId = req.headers.get("x-user-id");
    console.log("🔍 POST leadtypes x-user-id:", userId);

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required and must be a string" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is missing from headers" }, { status: 400 });
    }

    const result = await db.insert(leadtype).values({
      name,
      created_at: new Date(),
      user_id: Number(userId),
      status: typeof status === "number" ? status : 1,
    });

    return NextResponse.json({ success: true, message: "Lead type created", data: result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error inserting leadtype:", error.message);
    } else {
      console.error("Unknown error inserting leadtype:", error);
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    console.log("🔍 GET leadtypes x-user-id:", userId);

    if (!userId) {
      return NextResponse.json({ error: "User ID is missing from headers" }, { status: 400 });
    }

    const result = await db
      .select({
        id: leadtype.id,
        name: leadtype.name,
        created_at: leadtype.created_at,
        leadCount: count(leads.id),
      })
      .from(leadtype)
      .leftJoin(leads, and(
        eq(leads.leadtype, leadtype.id),
        eq(leads.user_id, Number(userId))
      ))
      .where(eq(leadtype.user_id, Number(userId)))
      .groupBy(leadtype.id)
      .orderBy(desc(leadtype.created_at));

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching leadtypes with join:", error.message);
    } else {
      console.error("Unknown error fetching leadtypes with join:", error);
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}

// Update First 100 Leads in a Lead Type
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const listId = Number(body.selectedList);
    const marketingChannel = body.selectedChannel;
    const userId = Number(req.headers.get("x-user-id"));

    console.log("🔁 Incoming PUT:", { listId, marketingChannel, userId });

    if (!listId || !marketingChannel || !userId) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // ✅ Update all matching leads directly
    const result = await db
      .update(leads)
      .set({ markettype: marketingChannel, leadtype: listId })
      .where(
        eq(leads.user_id, userId)
      );

    console.log("✅ Update Result:", result);
    return NextResponse.json({ success: true, message: `Leads updated successfully.` });

  } catch (error) {
    console.error("❌ Error in PUT API:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

