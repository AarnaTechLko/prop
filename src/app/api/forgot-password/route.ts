import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  // Add other fields from your users table
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    console.log("📥 Password reset requested for:", email);

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'landos',
    });

   const [users] = await connection.execute<User[]>(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

    console.log('Users found:', users);

    // ✨ Return error if email not found
    if (users.length === 0) {
      await connection.end();
      return NextResponse.json(
        {
          message: 'This Email is not registered on our Platform!',
        },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await connection.execute('DELETE FROM password_resets WHERE email = ?', [email]);
    await connection.execute(
      'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [email, token, expiresAt]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sanjanakannajiya9@gmail.com',
        pass: 'enjjauiqdrcovhix',
      },
    });

    await transporter.verify();

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

const mailOptions = {
  from: '"Land OS" <sanjanakannajiya9@gmail.com>', // Use your verified sender email
  to: email, // recipient's email from the request
  subject: 'Password Reset Request',
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Reset Your Password</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
      <p>If you did not request this, please ignore this email.</p>
      <p><small>This link will expire in 1 hour.</small></p>
    </div>
  `,
};


    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("📨 Email sent:", info.messageId);
    } catch (emailError) {
      console.error("❌ Failed to send reset email:", emailError);
    }

    await connection.end();

    return NextResponse.json({
      message: 'Reset link has been sent to your email.',
    });

  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("❌ Error in /api/forgot-password:", error.message);
  } else {
    console.error("❌ Unknown error in /api/forgot-password:", error);
  }

  return NextResponse.json(
    { message: 'Something went wrong. Please try again later.' },
    { status: 500 }
  );
}

}
