import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { leads } from "@/db/schema";
interface RawLead {
  user_id: string | number;
  first_name?: string;
  phone1?: string;
  score?: string | number;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const leadData = body.leads;

    if (!Array.isArray(leadData)) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    const formattedLeads = leadData.map((lead: RawLead) => ({
      user_id: Number(lead.user_id),
      first_name: lead.first_name?.trim() || null,
      phone1: lead.phone1?.trim() || null,
      score: Number(lead.score) || 0,
    }));

    const chunks = chunkArray(formattedLeads, 10); // Insert 10 at a time

    for (const chunk of chunks) {
      await db.insert(leads).values(chunk);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Error inserting leadtype:", error.message);
  } else {
    console.error("Error inserting leadtype:", error);
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

}
