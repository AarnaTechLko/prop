import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { tempLeads } from '@/db/schema';
import { eq,} from 'drizzle-orm';

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
