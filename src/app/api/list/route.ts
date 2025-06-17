import { db } from '@/db/db';
import { leads } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const userIdHeader = req.headers.get('x-user-id');
    if (!userIdHeader) {
      return NextResponse.json({ success: false, message: 'User ID missing in headers' }, { status: 400 });
    }

    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const result = await db
      .select({
        leadtype: leads.leadtype,
        count: sql<number>`COUNT(${leads.id})`.as('count'),
      })
      .from(leads)
      .where(eq(leads.user_id, userId))
      .groupBy(leads.leadtype);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: unknown) {
  console.error('GET /api/list error:', error);

  const message =
    error instanceof Error ? error.message : 'Server error';

  return NextResponse.json({ success: false, message }, { status: 500 });
}

}
