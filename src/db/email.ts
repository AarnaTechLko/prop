import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
 const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.enjjauiqdrcovhix,
  },
});

  await transporter.sendMail({
    from: `"Land OS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
