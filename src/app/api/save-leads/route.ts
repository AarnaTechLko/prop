import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { leads } from "@/db/schema";
interface Lead {
  user_id: string | number;
  first_name?: string;
  last_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  mailing_street_address?: string;
  mailing_city?: string;
  mailing_state?: string;
  phone1?: string;
  phone1_type?: string;
  phone2?: string;
  phone2_type?: string;
  phone3?: string;
  phone3_type?: string;
  phone4?: string;
  phone4_type?: string;
  phone5?: string;
  phone5_type?: string;
  email1?: string;
  email2?: string;
  email3?: string;
  email4?: string;
  email5?: string;
  social_network1?: string;
  social_handle1?: string;
  social_network2?: string;
  social_handle2?: string;
  apn?: string;
  score?: number | string;
  // [key: string]: any;
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

    const formattedLeads = leadData.map((lead: Lead) => ({
     user_id: Number(lead.user_id),
  first_name: lead.first_name?.trim() || null,
  last_name: lead.last_name?.trim() || null,
  street_address: lead.street_address?.trim() || null,
  city: lead.city?.trim() || null,
  state: lead.state?.trim() || null,
  zip_code: lead.zip_code?.trim() || null,
  mailing_street_address: lead.mailing_street_address?.trim() || null,
  mailing_city: lead.mailing_city?.trim() || null,
  mailing_state: lead.mailing_state?.trim() || null,
  phone1: lead.phone1?.trim() || null,
  phone1_type: lead.phone1_type?.trim() || null,
  phone2: lead.phone2?.trim() || null,
  phone2_type: lead.phone2_type?.trim() || null,
  phone3: lead.phone3?.trim() || null,
  phone3_type: lead.phone3_type?.trim() || null,
  phone4: lead.phone4?.trim() || null,
  phone4_type: lead.phone4_type?.trim() || null,
  phone5: lead.phone5?.trim() || null,
  phone5_type: lead.phone5_type?.trim() || null,
  email1: lead.email1?.trim() || null,
  email2: lead.email2?.trim() || null,
  email3: lead.email3?.trim() || null,
  email4: lead.email4?.trim() || null,
  email5: lead.email5?.trim() || null,
  social_network1: lead.social_network1?.trim() || null,
  social_handle1: lead.social_handle1?.trim() || null,
  social_network2: lead.social_network2?.trim() || null,
  social_handle2: lead.social_handle2?.trim() || null,
  apn: lead.apn?.trim() || null,

  score: Number(lead.score) || 0
    }));

    const chunks = chunkArray(formattedLeads, 10); // Insert 10 at a time

    for (const chunk of chunks) {
      await db.insert(leads).values(chunk);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
  console.error("❌ Drizzle insert error:", error);

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
}

}
