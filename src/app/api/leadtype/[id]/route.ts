import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { leadtype } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Utility function to extract ID from URL
function getIdFromUrl(url: string | null): number | null {
  if (!url) return null;

  try {
    const segments = new URL(url).pathname.split('/');
    const idString = segments[segments.length - 1];
    const id = parseInt(idString);
    return isNaN(id) ? null : id;
  } catch {
    return null;
  }
}

// DELETE /api/leadtype/:id
export function DELETE(req: NextRequest): Promise<NextResponse> {
  const id = getIdFromUrl(req.url);

  if (id === null) {
    return Promise.resolve(
      NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    );
  }

  return db
    .delete(leadtype)
    .where(eq(leadtype.id, id))
    .then(() => NextResponse.json({ message: 'Lead list deleted' }))
    .catch((error) => {
      console.error('DELETE error:', error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    });
}

// PATCH /api/leadtype/:id
export function PATCH(req: NextRequest): Promise<NextResponse> {
  const id = getIdFromUrl(req.url);

  if (id === null) {
    return Promise.resolve(
      NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    );
  }

  return req
    .json()
    .then((body) => {
      const name = body.name?.trim();
      if (!name) {
        return Promise.resolve(
          NextResponse.json({ message: 'Name is required' }, { status: 400 })
        );
      }

      return db
        .update(leadtype)
        .set({ name })
        .where(eq(leadtype.id, id))
        .then(() => NextResponse.json({ message: 'Lead list updated' }));
    })
    .catch((error) => {
      console.error('PATCH error:', error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    });
}
