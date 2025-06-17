import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { tempLeads } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID missing in header' },
                { status: 401 }
            );
        }

        const body = await req.json();

        if (!Array.isArray(body)) {
            return NextResponse.json(
                { success: false, message: 'Invalid data format' },
                { status: 400 }
            );
        }

        for (const item of body) {
            const { score } = item;

            // Validate fields
            if (typeof score !== 'number') continue;

            const numericUserId = Number(userId);
            await db
                .update(tempLeads)
                .set({ score })
                .where(and(eq(tempLeads.user_id, numericUserId), eq(tempLeads.id, item.id)));
        }


        return NextResponse.json({ success: true, message: 'Scores updated successfully' });
    } catch (error) {
        console.error('Error updating scores:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
