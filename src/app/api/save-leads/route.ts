import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { leads } from "@/db/schema";

interface Lead {
  user_id: number;
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
  vacant?: string;
  absentee?: string;
  occupancy?: string;
  ownership_type?: string;
  formatted_apn?: string;
  census_tract?: string;
  subdivision?: string;
  tract_number?: string;
  company_flag?: string;
  owner_type?: string;
  primary_owner_first?: string;
  primary_owner_middle?: string;
  primary_owner_last?: string;
  secondary_owner_first?: string;
  secondary_owner_middle?: string;
  secondary_owner_last?: string;
  assessor_last_sale_date?: string;
  assessor_last_sale_amount?: string;
  assessor_prior_sale_date?: string;
  assessor_prior_sale_amount?: string;
  area_building?: string;
  living_sqft?: string;
  area_lot_acres?: string;
  area_lot_sf?: string;
  parking_garage?: string;
  pool?: string;
  bath_count?: string;
  bedrooms_count?: string;
  stories_count?: string;
  energy?: string;
  fuel?: string;
  score?: string;
  estimated_value?: string;
  estimated_min_value?: string;
  estimated_max_value?: string;
  markettype: string;
  leadtype: string;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ✅ FIXED: Format to 'YYYY-MM-DD' as MySQL DATE requires
function parseDate(input?: string): string | null {
  if (!input) return null;
  const date = new Date(input);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0]; // "2016-08-17"
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const leadData: Lead[] = body.leads;

    if (!Array.isArray(leadData)) {
      return NextResponse.json({ success: false, message: "Invalid leads array" }, { status: 400 });
    }

    const formattedLeads = leadData.map((lead) => ({
      user_id: Number(lead.user_id),
      first_name: lead.first_name || null,
      last_name: lead.last_name || null,
      street_address: lead.street_address || null,
      city: lead.city || null,
      state: lead.state || null,
      zip_code: lead.zip_code || null,
      mailing_street_address: lead.mailing_street_address || null,
      mailing_city: lead.mailing_city || null,
      mailing_state: lead.mailing_state || null,
      phone1: lead.phone1 || null,
      phone1_type: lead.phone1_type || null,
      phone2: lead.phone2 || null,
      phone2_type: lead.phone2_type || null,
      phone3: lead.phone3 || null,
      phone3_type: lead.phone3_type || null,
      phone4: lead.phone4 || null,
      phone4_type: lead.phone4_type || null,
      phone5: lead.phone5 || null,
      phone5_type: lead.phone5_type || null,
      email1: lead.email1 || null,
      email2: lead.email2 || null,
      email3: lead.email3 || null,
      email4: lead.email4 || null,
      email5: lead.email5 || null,
      social_network1: lead.social_network1 || null,
      social_handle1: lead.social_handle1 || null,
      social_network2: lead.social_network2 || null,
      social_handle2: lead.social_handle2 || null,
      apn: lead.apn || null,
      vacant: lead.vacant === "1" ? 1 : 0,
      absentee: lead.absentee === "1" ? 1 : 0,
      occupancy: lead.occupancy || null,
      ownership_type: lead.ownership_type || null,
      formatted_apn: lead.formatted_apn || null,
      census_tract: lead.census_tract || null,
      subdivision: lead.subdivision || null,
      tract_number: lead.tract_number || null,
      company_flag: lead.company_flag === "1" ? 1 : 0,
      owner_type: lead.owner_type || null,
      primary_owner_first: lead.primary_owner_first || null,
      primary_owner_middle: lead.primary_owner_middle || null,
      primary_owner_last: lead.primary_owner_last || null,
      secondary_owner_first: lead.secondary_owner_first || null,
      secondary_owner_middle: lead.secondary_owner_middle || null,
      secondary_owner_last: lead.secondary_owner_last || null,
      assessor_last_sale_date: parseDate(lead.assessor_last_sale_date),
      assessor_last_sale_amount: lead.assessor_last_sale_amount ? parseFloat(lead.assessor_last_sale_amount) : null,
      assessor_prior_sale_date: parseDate(lead.assessor_prior_sale_date),
      assessor_prior_sale_amount: lead.assessor_prior_sale_amount ? parseFloat(lead.assessor_prior_sale_amount) : null,
      area_building: lead.area_building || null,
      living_sqft: lead.living_sqft ? parseInt(lead.living_sqft) : null,
      area_lot_acres: lead.area_lot_acres ? parseFloat(lead.area_lot_acres) : null,
      area_lot_sf: lead.area_lot_sf ? parseInt(lead.area_lot_sf) : null,
      parking_garage: lead.parking_garage || null,
      pool: lead.pool === "1" ? 1 : 0,
      bath_count: lead.bath_count ? parseFloat(lead.bath_count) : null,
      bedrooms_count: lead.bedrooms_count ? parseInt(lead.bedrooms_count) : null,
      stories_count: lead.stories_count ? parseInt(lead.stories_count) : null,
      energy: lead.energy || null,
      fuel: lead.fuel || null,
      score: lead.score ? parseInt(lead.score) : 0,
      leadtype: Number(lead.leadtype) || 0,
      estimated_value: lead.estimated_value ? parseFloat(lead.estimated_value) : null,
      estimated_min_value: lead.estimated_min_value ? parseFloat(lead.estimated_min_value) : null,
      estimated_max_value: lead.estimated_max_value ? parseFloat(lead.estimated_max_value) : null,
      markettype: lead.markettype,
    }));

    const chunks = chunkArray(formattedLeads, 100);
    for (const chunk of chunks) {
      await db.insert(leads).values(chunk as typeof leads.$inferInsert[]);
    }

    return NextResponse.json({ success: true, message: `Inserted ${formattedLeads.length} leads` });
  } catch (err: unknown) {
    console.error("Insert Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}