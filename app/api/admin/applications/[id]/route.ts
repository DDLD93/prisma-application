import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      session: true,
      payments: true,
      admission: true,
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: application.id,
    userId: application.userId,
    wardName: application.wardName,
    wardDob: application.wardDob.toISOString().slice(0, 10),
    wardGender: application.wardGender,
    class: application.class ?? undefined,
    sessionId: application.sessionId,
    sessionYear: application.session.year,
    status: application.status,
    payments: application.payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      status: p.status,
      verifiedBy: p.verifiedBy,
    })),
    admission: application.admission
      ? {
          id: application.admission.id,
          status: application.admission.status,
          class: application.admission.class ?? undefined,
        }
      : undefined,
    createdAt: application.createdAt.toISOString(),
  });
}
