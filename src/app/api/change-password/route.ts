// app/api/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { userId, oldPassword, newPassword } = await req.json();

  if (!userId || !oldPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(userId)));

  if (!user || !user.password) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return NextResponse.json({ error: "Old password is incorrect" }, { status: 401 });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({ password: hashedNewPassword })
    .where(eq(users.id, Number(userId)));

  return NextResponse.json({ message: "Password updated successfully" });
}
