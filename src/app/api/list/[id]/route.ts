import { db } from '@/db/db';
import { leads } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; // Assuming route is /api/list/[id]

    const leadtype = parseInt(id, 10);
    const userIdHeader = req.headers.get('x-user-id');

    if (!userIdHeader) {
      return NextResponse.json({ success: false, message: 'User ID missing in headers' }, { status: 400 });
    }

    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId) || isNaN(leadtype)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or leadtype ID' }, { status: 400 });
    }

    const result = await db
      .select()
      .from(leads)
      .where(and(eq(leads.user_id, userId), eq(leads.leadtype, leadtype)));

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: unknown) {
    console.error('GET /api/list error:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}



