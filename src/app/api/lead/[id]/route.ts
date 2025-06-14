import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { leads } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

interface TypedError {
  message?: string;
  status?: number;
}

// Utility: Extract ID from URL
const extractLeadIdFromUrl = (req: NextRequest): number => {
  const urlParts = req.nextUrl.pathname.split('/');
  const idStr = urlParts[urlParts.length - 1]; // Assumes last part of path is the [id]
  const id = parseInt(idStr);
  if (isNaN(id)) throw { status: 400, message: 'Invalid ID in URL' };
  return id;
};

// Utility: Get user ID from header
const getUserIdFromHeader = (req: NextRequest): number => {
  const userIdHeader = req.headers.get('x-user-id');
  if (!userIdHeader) throw { status: 400, message: 'Missing user ID' };
  const userId = parseInt(userIdHeader);
  if (isNaN(userId)) throw { status: 400, message: 'Invalid user ID' };
  return userId;
};

// -------------------------
// ✅ GET Lead by ID (no params)
// -------------------------
export async function GET(req: NextRequest) {
  try {
    const leadId = extractLeadIdFromUrl(req);
    const userId = getUserIdFromHeader(req);

    const result = await db
      .select()
      .from(leads)
      .where(and(eq(leads.id, leadId), eq(leads.user_id, userId)))
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: unknown) {
    const err = error as TypedError;
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: err.status || 500 }
    );
  }
}

// -------------------------
// ✅ PUT Update Lead by ID (no params)
// -------------------------
export async function PUT(req: NextRequest) {
  try {
    const leadId = extractLeadIdFromUrl(req);
    const userId = getUserIdFromHeader(req);
    const body = await req.json();

    const updateData: Partial<typeof leads.$inferInsert> = {
      first_name: body.first_name,
      last_name: body.last_name,
      street_address: body.street_address,
      city: body.city,
      state: body.state,
      zip_code: body.zip_code,
      mailing_street_address: body.mailing_street_address,
      mailing_city: body.mailing_city,
      mailing_state: body.mailing_state,
      phone1: body.phone1,
      phone1_type: body.phone1_type,
      phone2: body.phone2,
      phone2_type: body.phone2_type,
      phone3: body.phone3,
      phone3_type: body.phone3_type,
      phone4: body.phone4,
      phone4_type: body.phone4_type,
      phone5: body.phone5,
      phone5_type: body.phone5_type,
      email1: body.email1,
      email2: body.email2,
      email3: body.email3,
      email4: body.email4,
      email5: body.email5,
      social_network1: body.social_network1,
      social_handle1: body.social_handle1,
      social_network2: body.social_network2,
      social_handle2: body.social_handle2,
      apn: body.apn,
      vacant: body.vacant,
      absentee: body.absentee,
      occupancy: body.occupancy,
      ownership_type: body.ownership_type,
      formatted_apn: body.formatted_apn,
      census_tract: body.census_tract,
      subdivision: body.subdivision,
      tract_number: body.tract_number,
      company_flag: body.company_flag,
      owner_type: body.owner_type,
      primary_owner_first: body.primary_owner_first,
      primary_owner_middle: body.primary_owner_middle,
      primary_owner_last: body.primary_owner_last,
      secondary_owner_first: body.secondary_owner_first,
      secondary_owner_middle: body.secondary_owner_middle,
      secondary_owner_last: body.secondary_owner_last,
      assessor_last_sale_date: body.assessor_last_sale_date,
      assessor_last_sale_amount: body.assessor_last_sale_amount,
      assessor_prior_sale_date: body.assessor_prior_sale_date,
      assessor_prior_sale_amount: body.assessor_prior_sale_amount,
      area_building: body.area_building,
      living_sqft: body.living_sqft,
      area_lot_acres: body.area_lot_acres,
      area_lot_sf: body.area_lot_sf,
      parking_garage: body.parking_garage,
      pool: body.pool,
      bath_count: body.bath_count,
      bedrooms_count: body.bedrooms_count,
      stories_count: body.stories_count,
      energy: body.energy,
      fuel: body.fuel,
      estimated_value: body.estimated_value,
      estimated_min_value: body.estimated_min_value,
      estimated_max_value: body.estimated_max_value,
    };

    await db
      .update(leads)
      .set(updateData)
      .where(and(eq(leads.id, leadId), eq(leads.user_id, userId)));

    const updatedLead = await db
      .select()
      .from(leads)
      .where(and(eq(leads.id, leadId), eq(leads.user_id, userId)))
      .limit(1);

    if (!updatedLead.length) {
      return NextResponse.json(
        { success: false, message: 'Lead not found or not updated' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead[0],
    });
  } catch (error: unknown) {
    const err = error as TypedError;
    return NextResponse.json(
      { success: false, message: err.message || 'Server error' },
      { status: err.status || 500 }
    );
  }
}
