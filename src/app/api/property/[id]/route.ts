import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';


function getPropertyIdFromHeader(req: NextRequest): Promise<number> {
  return new Promise((resolve, reject) => {
    const idHeader = req.headers.get('x-property-id');
    if (!idHeader) return reject('Missing ID in header');
    const id = parseInt(idHeader);
    if (isNaN(id)) return reject('Invalid ID in header');
    resolve(id);
  });
}
export async function DELETE(req: NextRequest) {
  try {
    const propertyId = await getPropertyIdFromHeader(req); // 👈 Promise-based ID

    await db.delete(properties).where(eq(properties.id, propertyId));

    return NextResponse.json(
      { success: true, message: 'Property deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 400 }
    );
  }
}



export async function PUT(req: NextRequest) {
  try {
    const propertyId = await getPropertyIdFromHeader(req); // 👈 use Promise to get ID
    const formData = await req.formData();

    const updatedData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      price: Number(formData.get('price')),
      bedrooms: Number(formData.get('bedrooms')),
      bathrooms: Number(formData.get('bathrooms')),
      description: formData.get('description') as string,
      image: formData.get('image') as string,
    };

    await db.update(properties).set(updatedData).where(eq(properties.id, propertyId));

    return NextResponse.json({ message: 'Property updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
export async function GET(req: NextRequest) {
  try {
    const propertyId = await getPropertyIdFromHeader(req); // 👈 use Promise to get ID

    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));

    if (!result.length) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}