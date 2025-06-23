import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { leads } from '@/db/schema'; // Assuming a mapping table for leads ↔ lists
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { leadId, leadtype } = body;

    if (!leadId || !leadtype) {
        return NextResponse.json({ success: false, message: "Missing fields" });
    }

    try {
        await db
            .update(leads)
            .set({ leadtype })
            .where(eq(leads.id, leadId));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "DB update failed" });
    }
}
