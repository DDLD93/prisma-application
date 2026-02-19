import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function sessionToJson(s: {
  id: string;
  year: number;
  openAt: Date;
  closeAt: Date;
  amount: { toNumber?: () => number };
  availableClasses: string[];
  status: string;
}) {
  return {
    id: s.id,
    year: s.year,
    openAt: s.openAt.toISOString(),
    closeAt: s.closeAt.toISOString(),
    amount: Number(s.amount),
    availableClasses: s.availableClasses,
    status: s.status,
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  let body: {
    year?: number;
    openAt?: string;
    closeAt?: string;
    amount?: number;
    availableClasses?: string[];
    status?: "ACTIVE" | "INACTIVE" | "CONCLUDED";
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await prisma.applicationSession.findUnique({
    where: { id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const data: Parameters<typeof prisma.applicationSession.update>[0]["data"] = {};
  if (body.year != null) data.year = Number(body.year);
  if (body.openAt != null) data.openAt = new Date(body.openAt);
  if (body.closeAt != null) data.closeAt = new Date(body.closeAt);
  if (body.amount != null) data.amount = body.amount;
  if (body.availableClasses !== undefined)
    data.availableClasses = Array.isArray(body.availableClasses)
      ? body.availableClasses
      : [];
  if (body.status != null) data.status = body.status;

  const session = await prisma.applicationSession.update({
    where: { id },
    data,
  });
  return NextResponse.json(sessionToJson(session));
}
