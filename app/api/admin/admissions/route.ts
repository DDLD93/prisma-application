import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const ADMISSION_STATUSES = ["PENDING", "OFFERED", "ACCEPTED", "DECLINED"] as const;

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
    session?: { id: string; year: number };
  };
}) {
  const base = {
    id: a.id,
    applicationId: a.applicationId,
    class: a.class ?? undefined,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
  if (a.application) {
    return {
      ...base,
      application: {
        id: a.application.id,
        wardName: a.application.wardName,
        sessionId: a.application.sessionId,
        ...(a.application.session && {
          sessionYear: a.application.session.year,
        }),
      },
    };
  }
  return base;
}

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  const where: Parameters<typeof prisma.admission.findMany>[0]["where"] = {};
  if (sessionId) {
    where.application = { sessionId };
  }
  if (status && ADMISSION_STATUSES.includes(status as (typeof ADMISSION_STATUSES)[number])) {
    where.status = status as "PENDING" | "OFFERED" | "ACCEPTED" | "DECLINED";
  }

  const [data, total] = await Promise.all([
    prisma.admission.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.admission.count({ where }),
  ]);

  return NextResponse.json({
    data: data.map(admissionToJson),
    total,
    page,
    limit,
  });
}

export async function POST(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  let body: {
    applicationId: string;
    class?: string | null;
    status?: "PENDING" | "OFFERED" | "ACCEPTED" | "DECLINED";
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { applicationId, class: className, status } = body;
  if (!applicationId) {
    return NextResponse.json(
      { error: "Missing applicationId" },
      { status: 400 }
    );
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { admission: true },
  });
  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }
  if (application.admission) {
    return NextResponse.json(
      { error: "Application already has an admission" },
      { status: 400 }
    );
  }

  const admission = await prisma.admission.create({
    data: {
      applicationId,
      class: className ?? undefined,
      status: status ?? "PENDING",
    },
  });

  return NextResponse.json(admissionToJson(admission));
}
