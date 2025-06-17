import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { db } from '@/db/db';
import { tempLeads } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export const runtime = 'nodejs';

interface LeadCSVRow {
  ['First Name']?: string;
  ['Last Name']?: string;
  ['Street Address']?: string;
  ['City']?: string;
  ['State']?: string;
  ['Zip Code']?: string;
  ['Mailing Street Address']?: string;
  ['Mailing City']?: string;
  ['Mailing State']?: string;
  ['Phone 1']?: string;
  ['Phone 1 Type']?: string;
  ['Phone 2']?: string;
  ['Phone 2 Type']?: string;
  ['Phone 3']?: string;
  ['Phone 3 Type']?: string;
  ['Phone 4']?: string;
  ['Phone 4 Type']?: string;
  ['Phone 5']?: string;
  ['Phone 5 Type']?: string;
  ['Email 1']?: string;
  ['Email 2']?: string;
  ['Email 3']?: string;
  ['Email 4']?: string;
  ['Email 5']?: string;
  ['Social Network 1']?: string;
  ['Social Handle 1']?: string;
  ['Social Network 2']?: string;
  ['Social Handle 2']?: string;
  ['APN']?: string;
  ['Vacant']?: string;
  ['Absentee']?: string;
  ['Occupancy']?: string;
  ['Ownership Type']?: string;
  ['Formatted APN']?: string;
  ['Census Tract']?: string;
  ['Subdivision']?: string;
  ['Tract Number']?: string;
  ['Company Flag']?: string;
  ['Owner Type']?: string;
  ['Primary Owner First']?: string;
  ['Primary Owner Middle']?: string;
  ['Primary Owner Last']?: string;
  ['Secondary Owner First']?: string;
  ['Secondary Owner Middle']?: string;
  ['Secondary Owner Last']?: string;
  ['Assessor Last Sale Date']?: string;
  ['Assessor Last Sale Amount']?: string;
  ['Assessor Prior Sale Date']?: string;
  ['Assessor Prior Sale Amount']?: string;
  ['Area Building']?: string;
  ['Living SqFt']?: string;
  ['Area Lot Acres']?: string;
  ['Area Lot S F']?: string;
  ['Parking Garage']?: string;
  ['Pool']?: string;
  ['Bath Count']?: string;
  ['Bedrooms Count']?: string;
  ['Stories Count']?: string;
  ['Energy']?: string;
  ['Fuel']?: string;
  ['Estimated Value']?: string;
  ['Estimated Min Value']?: string;
  ['Estimated Max Value']?: string;
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse<LeadCSVRow>(text, { header: true });

    if (parsed.errors.length) {
      console.error('CSV Parsing Errors:', parsed.errors);
      return NextResponse.json({ error: 'Invalid CSV' }, { status: 400 });
    }

    const rows = parsed.data;

    // Step 1: Extract all APNs from the uploaded CSV
    const apnList = rows.map((row) => row['APN']).filter(Boolean) as string[];

    // Step 2: Get existing APNs from database for this user
    const existingApns = await db
      .select({ apn: tempLeads.apn })
      .from(tempLeads)
      .where(and(inArray(tempLeads.apn, apnList), eq(tempLeads.user_id, Number(userId))));

    const existingApnSet = new Set(existingApns.map((lead) => lead.apn));

    // Step 3: Filter out rows that already exist by APN
    const uniqueRows = rows.filter((row) => {
      const apn = row['APN'];
      return apn && !existingApnSet.has(apn);
    });
 

    
    if (uniqueRows.length === 0) {
  return NextResponse.json({
    error: 'CSV already uploaded — all APNs already exist.',
  }, { status: 409 });
}
    // Step 4: Format for insertion
    
    const formattedRows = uniqueRows.map((row) => ({
      user_id: Number(userId),
      first_name: row['First Name'] || null,
      last_name: row['Last Name'] || null,
      street_address: row['Street Address'] || null,
      city: row['City'] || null,
      state: row['State'] || null,
      zip_code: row['Zip Code'] || null,
      mailing_street_address: row['Mailing Street Address'] || null,
      mailing_city: row['Mailing City'] || null,
      mailing_state: row['Mailing State'] || null,
      phone1: row['Phone 1'] || null,
      phone1_type: row['Phone 1 Type'] || null,
      phone2: row['Phone 2'] || null,
      phone2_type: row['Phone 2 Type'] || null,
      phone3: row['Phone 3'] || null,
      phone3_type: row['Phone 3 Type'] || null,
      phone4: row['Phone 4'] || null,
      phone4_type: row['Phone 4 Type'] || null,
      phone5: row['Phone 5'] || null,
      phone5_type: row['Phone 5 Type'] || null,
      email1: row['Email 1'] || null,
      email2: row['Email 2'] || null,
      email3: row['Email 3'] || null,
      email4: row['Email 4'] || null,
      email5: row['Email 5'] || null,
      social_network1: row['Social Network 1'] || null,
      social_handle1: row['Social Handle 1'] || null,
      social_network2: row['Social Network 2'] || null,
      social_handle2: row['Social Handle 2'] || null,
      apn: row['APN'] || null,
      vacant: row['Vacant'] === '1' ? 1 : 0,
      absentee: row['Absentee'] === '1' ? 1 : 0,
      occupancy: row['Occupancy'] || null,
      ownership_type: row['Ownership Type'] || null,
      formatted_apn: row['Formatted APN'] || null,
      census_tract: row['Census Tract'] || null,
      subdivision: row['Subdivision'] || null,
      tract_number: row['Tract Number'] || null,
      company_flag: row['Company Flag'] === '1' ? 1 : 0,
      owner_type: row['Owner Type'] || null,
      primary_owner_first: row['Primary Owner First'] || null,
      primary_owner_middle: row['Primary Owner Middle'] || null,
      primary_owner_last: row['Primary Owner Last'] || null,
      secondary_owner_first: row['Secondary Owner First'] || null,
      secondary_owner_middle: row['Secondary Owner Middle'] || null,
      secondary_owner_last: row['Secondary Owner Last'] || null,
      assessor_last_sale_date: row['Assessor Last Sale Date'] ? new Date(row['Assessor Last Sale Date']) : null,
      assessor_last_sale_amount: row['Assessor Last Sale Amount'] ? parseFloat(row['Assessor Last Sale Amount']) : null,
      assessor_prior_sale_date: row['Assessor Prior Sale Date'] ? new Date(row['Assessor Prior Sale Date']) : null,
      assessor_prior_sale_amount: row['Assessor Prior Sale Amount'] ? parseFloat(row['Assessor Prior Sale Amount']) : null,
      area_building: row['Area Building'] || null,
      living_sqft: row['Living SqFt'] ? parseInt(row['Living SqFt'], 10) : null,
      area_lot_acres: row['Area Lot Acres'] ? parseFloat(row['Area Lot Acres']) : null,
      area_lot_sf: row['Area Lot S F'] ? parseInt(row['Area Lot S F'], 10) : null,
      parking_garage: row['Parking Garage'] || null,
      pool: row['Pool'] === '1' ? 1 : 0,
      bath_count: row['Bath Count'] ? parseFloat(row['Bath Count']) : null,
      bedrooms_count: row['Bedrooms Count'] ? parseInt(row['Bedrooms Count'], 10) : null,
      stories_count: row['Stories Count'] ? parseInt(row['Stories Count'], 10) : null,
      energy: row['Energy'] || null,
      fuel: row['Fuel'] || null,
      estimated_value: row['Estimated Value'] ? parseFloat(row['Estimated Value']) : null,
      estimated_min_value: row['Estimated Min Value'] ? parseFloat(row['Estimated Min Value']) : null,
      estimated_max_value: row['Estimated Max Value'] ? parseFloat(row['Estimated Max Value']) : null,
    }));

    // Step 5: Insert only unique APN rows in chunks
    const chunkSize = 500;
    for (let i = 0; i < formattedRows.length; i += chunkSize) {
      const chunk = formattedRows.slice(i, i + chunkSize);
      await db.insert(tempLeads).values(chunk as typeof tempLeads.$inferInsert[]);
    }

    return NextResponse.json({
      success: true,
      totalUploaded: rows.length,
      inserted: formattedRows.length,
      duplicatesFiltered: rows.length - formattedRows.length,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



