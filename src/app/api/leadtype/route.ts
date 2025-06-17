import { NextResponse } from "next/server";
import { db } from "@/db/db"; // Adjust this import to your Drizzle DB instance
import { leadtype } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, status } = body;

    // Validate input
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required and must be a string" }, { status: 400 });
    }

    const createdAt = new Date();

    const result = await db.insert(leadtype).values({
      name,
      createdAt,
      status: typeof status === "number" ? status : null,
    });

    return NextResponse.json({ success: true, message: "Lead type created", data: result });
 } catch (error: unknown) {
  console.error("Error inserting leadtype:", error);
  const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}

}

// GET /api/leadtype — Fetch all lead types
export async function GET() {
  try {
    const result = await db.select().from(leadtype).orderBy(leadtype.createdAt);
    return NextResponse.json(result);
  
  } catch (error: unknown) {
  console.error("Error fetching leadtype:", error);
  const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}

}