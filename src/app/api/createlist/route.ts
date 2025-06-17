import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { tempLeads } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const userIdHeader = req.headers.get('x-user-id');
    const userId = Number(userIdHeader);

    if (!userIdHeader || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid or missing user ID' }, { status: 400 });
    }

    const data = await db
      .select({
        id: tempLeads.id,
        first_name: tempLeads.first_name,
        phone1: tempLeads.phone1,
        // score: tempLeads.score, // include if used in UI
      })
      .from(tempLeads)
      .where(eq(tempLeads.user_id, userId))
      .orderBy(tempLeads.id);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ /api/temp-leads error:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching leads', error: (error as Error).message },
      { status: 500 }
    );
  }
}
