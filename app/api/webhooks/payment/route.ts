import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Stub for payment gateway webhook.
 * Validate signature using WEBHOOK_PAYMENT_SECRET (or gateway-specific header).
 * On success: update Payment and Application status; return 200.
 */
export async function POST(request: Request) {
  const secret = process.env.WEBHOOK_PAYMENT_SECRET;
  const signature = request.headers.get("X-Webhook-Signature") ?? request.headers.get("x-signature");

  if (secret && signature !== secret) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { applicationId?: string; paymentId?: string; id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paymentId = body.paymentId ?? body.id;
  const applicationId = body.applicationId;
  const status = body.status ?? "COMPLETED";

  if (!paymentId && !applicationId) {
    return NextResponse.json(
      { error: "Missing paymentId or applicationId" },
      { status: 400 }
    );
  }

  if (paymentId) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { application: true },
    });
    if (payment && status === "COMPLETED") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: paymentId },
          data: { status: "COMPLETED", verifiedBy: "SYSTEM" },
        }),
        prisma.application.update({
          where: { id: payment.applicationId },
          data: { status: "PAID" },
        }),
      ]);
    }
  } else if (applicationId) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { payments: true },
    });
    if (application?.payments[0] && status === "COMPLETED") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: application.payments[0].id },
          data: { status: "COMPLETED", verifiedBy: "SYSTEM" },
        }),
        prisma.application.update({
          where: { id: applicationId },
          data: { status: "PAID" },
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
