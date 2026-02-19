import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function admissionToJson(a: {
  id: string;
  applicationId: string;
  class: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  application?: {
    id: string;
    wardName: string;
    sessionId: string;
    session?: { id: string; year: number } | null;
  };
}) {
  return {
    id: a.id,
    applicationId: a.applicationId,
    class: a.class ?? undefined,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    ...(a.application && {
      application: {
        id: a.application.id,
        wardName: a.application.wardName,
        sessionId: a.application.sessionId,
        ...(a.application.session && {
          sessionYear: a.application.session.year,
        }),
      },
    }),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const admission = await prisma.admission.findUnique({
    where: { id },
    include: {
      application: {
        select: {
          id: true,
          wardName: true,
          sessionId: true,
          session: { select: { id: true, year: true } },
        },
      },
    },
  });

  if (!admission) {
    return NextResponse.json({ error: "Admission not found" }, { status: 404 });
  }

  return NextResponse.json(admissionToJson(admission));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  let body: {
    class?: string | null;
    status?: "PENDING" | "OFFERED" | "ACCEPTED" | "DECLINED";
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await prisma.admission.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Admission not found" }, { status: 404 });
  }

  const data: Parameters<typeof prisma.admission.update>[0]["data"] = {};
  if (body.class !== undefined) data.class = body.class ?? null;
  if (body.status != null) data.status = body.status;

  const admission = await prisma.admission.update({
    where: { id },
    data,
    include: {
      application: {
        select: {
          id: true,
          wardName: true,
          sessionId: true,
          session: { select: { id: true, year: true } },
        },
      },
    },
  });

  return NextResponse.json(admissionToJson(admission));
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const existing = await prisma.admission.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Admission not found" }, { status: 404 });
  }

  await prisma.admission.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
