import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const payments = await prisma.payment.findMany({
    include: {
      application: { include: { session: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    payments.map((p) => ({
      id: p.id,
      applicationId: p.applicationId,
      wardName: p.application.wardName,
      sessionYear: p.application.session.year,
      amount: Number(p.amount),
      status: p.status,
      verifiedBy: p.verifiedBy,
      reference: p.reference,
      createdAt: p.createdAt.toISOString(),
    }))
  );
}
