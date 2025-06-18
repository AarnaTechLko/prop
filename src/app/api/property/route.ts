import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { db } from '@/db/db';
import { properties } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const type = formData.get('type') as string;
    const country = formData.get('country') as string;
    const state = formData.get('state') as string;
    const city = formData.get('city') as string;
    const address = formData.get('address') as string;
    const bedrooms = formData.get('bedrooms') as string;
    const bathrooms = formData.get('bathrooms') as string;
    const imageFile = formData.get('image') as File;

    let imageUrl = '';
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${uuidv4()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');

      // Ensure the uploads directory exists
      await mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    await db.insert(properties).values({
      name,
      description,
      price: Number(price),
      type,
      country,
      state,
      city,
      address,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      image: imageUrl,
    });

    return NextResponse.json({ message: 'Property added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding property:', error);
    return NextResponse.json({ error: 'Failed to add property' }, { status: 500 });
  }
}
 

export async function GET() {
  try {
    const result = await db.select().from(properties);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching properties:', error); // ✅ now `error` is used
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
