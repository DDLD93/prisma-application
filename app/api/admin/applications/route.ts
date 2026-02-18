import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const sessionId = searchParams.get("sessionId");

  const applications = await prisma.application.findMany({
    where: {
      ...(status ? { status: status as "SUBMITTED" | "PAID" | "COMPLETED" } : {}),
      ...(sessionId ? { sessionId } : {}),
    },
    include: {
      session: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    applications.map((a) => ({
      id: a.id,
      userId: a.userId,
      wardName: a.wardName,
      wardDob: a.wardDob.toISOString().slice(0, 10),
      wardGender: a.wardGender,
      class: a.class ?? undefined,
      sessionId: a.sessionId,
      sessionYear: a.session.year,
      status: a.status,
      payments: a.payments.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        status: p.status,
        verifiedBy: p.verifiedBy,
      })),
      createdAt: a.createdAt.toISOString(),
    }))
  );
}
