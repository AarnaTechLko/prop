// /app/api/update-lead-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { leadId, status } = body;

  if (!leadId || !status) {
    return NextResponse.json({ success: false, message: "Missing fields" });
  }

  try {
    await db
      .update(leads)
      .set({ status })
      .where(eq(leads.id, leadId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "DB update failed" });
  }
}

