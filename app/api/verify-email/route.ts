import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token?.trim() || !email?.trim()) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_link", request.url)
    );
  }

  const emailNorm = email.trim().toLowerCase();
  const verification = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: emailNorm,
        token: token.trim(),
      },
    },
  });

  if (!verification) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_or_expired_link", request.url)
    );
  }
  if (new Date() > verification.expires) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: emailNorm,
          token: token.trim(),
        },
      },
    });
    return NextResponse.redirect(
      new URL("/login?error=link_expired", request.url)
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: emailNorm },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: emailNorm,
          token: token.trim(),
        },
      },
    }),
  ]);

  const base = new URL(request.url).origin;
  return NextResponse.redirect(new URL("/login?verified=1", base));
}
