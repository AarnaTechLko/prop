import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { leads } from '@/db/schema';
import { eq} from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const userIdHeader = req.headers.get('x-user-id');
    const userId = Number(userIdHeader);

    if (!userIdHeader || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid or missing user ID' }, { status: 400 });
    }

    // Fetch all leads for the user
    const data = await db
      .select({
        id: leads.id,
        first_name: leads.first_name,
        email1: leads.email1,
        state: leads.state,
      })
      .from(leads)
      .where(eq(leads.user_id, userId))
      .orderBy(leads.id);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('❌ API /api/lead error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching leads',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}



export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');

    const leadId = idParam ? Number(idParam) : NaN;
    if (!idParam || isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid or missing lead ID' }, { status: 400 });
    }

    await db.delete(leads).where(eq(leads.id, leadId));

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('❌ API /api/lead DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting lead',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

