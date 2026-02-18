import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  let body: { verifiedBy?: "API_OVERRIDE" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { application: true },
  });
  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const verifiedBy = body.verifiedBy ?? "API_OVERRIDE";
  if (verifiedBy !== "API_OVERRIDE" && verifiedBy !== "SYSTEM") {
    return NextResponse.json(
      { error: "verifiedBy must be API_OVERRIDE or SYSTEM" },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id },
      data: { status: "COMPLETED", verifiedBy },
    }),
    prisma.application.update({
      where: { id: payment.applicationId },
      data: { status: "PAID" },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
