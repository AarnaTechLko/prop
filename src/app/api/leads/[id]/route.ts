import { db } from '@/db/db';
import { leads } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
    params: Promise<{ id: string }>; // 👈 params is a promise here
};

// GET /api/leads/[id]
export async function GET(req: NextRequest, context: Context) {
    const { id } = await context.params; // ✅ await it
    const numericId = Number(id);

    try {
        const result = await db.select().from(leads).where(eq(leads.id, numericId)).limit(1);

        if (result.length === 0) {
            return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ message: 'Failed to fetch lead' }, { status: 500 });
    }
}

// PUT /api/leads/[id]
export async function PUT(req: NextRequest, context: Context) {
    const { id } = await context.params; // ✅ await here too
    const numericId = Number(id);

    try {
        const body = await req.json();

        await db.update(leads).set(body).where(eq(leads.id, numericId));

        return NextResponse.json({ success: true, message: 'Lead updated' });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ message: 'Failed to update lead' }, { status: 500 });
    }
}

export function DELETE(req: NextRequest, context: Context) {
    return context.params
        .then((params) => {
            const id = Number(params.id);

            if (!id || isNaN(id)) {
                return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
            }

            return db
                .delete(leads)
                .where(eq(leads.id, id))
                .then(() => {
                    return NextResponse.json(
                        { message: 'Lead deleted successfully' },
                        { status: 200 }
                    );

                });
        })
        .catch((error) => {
            console.error('DELETE error:', error);
            return NextResponse.json({ message: 'Error deleting lead', error }, { status: 500 });
        });
}