import nodemailer from "nodemailer";

const transport =
  process.env.SMTP_HOST && process.env.SMTP_USER
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASSWORD
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              }
            : undefined,
      })
    : null;

const from = process.env.MAIL_FROM ?? "noreply@example.com";
const baseUrl =
  process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  if (!transport) {
    console.warn(
      "[mail] SMTP not configured (SMTP_HOST, SMTP_USER). Skipping verification email."
    );
    return;
  }
  const url = `${baseUrl}/api/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  await transport.sendMail({
    from,
    to: email,
    subject: "Verify your email",
    text: `Click the link below to verify your email:\n\n${url}\n\nIf you did not create an account, you can ignore this email.`,
    html: `<p>Click the link below to verify your email:</p><p><a href="${url}">Verify email</a></p><p>If you did not create an account, you can ignore this email.</p>`,
  });
}
