import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { tempLeads } from '@/db/schema';
import { eq,and } from 'drizzle-orm';

// POST: Update scores of leads
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("userid",userId);

    const leadsToUpdate = await req.json();

    if (!Array.isArray(leadsToUpdate)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    for (const lead of leadsToUpdate) {
      if (!lead.id || typeof lead.score !== 'number') continue;

      await db
        .update(tempLeads)
        .set({ score: lead.score })
        .where(
          and(
            eq(tempLeads.id, lead.id),
            eq(tempLeads.user_id, Number(userId))
          )
        );
    }

    return NextResponse.json({ success: true, message: 'Scores updated' });
  } catch (error) {
    console.error('Score update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// GET: Fetch all leads for a user (with score)
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    console.log("✅ Backend userId:", userId);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await db
      .select()
      .from(tempLeads)
      .where(eq(tempLeads.user_id, Number(userId)));

    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching scored leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
