import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  const where: Parameters<typeof prisma.admission.findMany>[0]["where"] = {};
  if (sessionId) {
    where.application = { sessionId };
  }

  const admissions = await prisma.admission.findMany({
    where,
    select: {
      status: true,
      class: true,
      applicationId: true,
      application: {
        select: { sessionId: true, session: { select: { year: true } } },
      },
    },
  });

  const total = admissions.length;
  const byStatus: Record<string, number> = {};
  const byClass: Record<string, number> = {};
  const bySession: Record<string, { sessionId: string; year: number; count: number }> = {};

  for (const a of admissions) {
    byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
    const cls = a.class ?? "(none)";
    byClass[cls] = (byClass[cls] ?? 0) + 1;
    if (a.application?.session) {
      const key = a.application.sessionId;
      if (!bySession[key]) {
        bySession[key] = {
          sessionId: a.application.sessionId,
          year: a.application.session.year,
          count: 0,
        };
      }
      bySession[key].count += 1;
    }
  }

  const response: {
    total: number;
    byStatus: Record<string, number>;
    byClass: Record<string, number>;
    bySession?: Array<{ sessionId: string; year: number; count: number }>;
  } = {
    total,
    byStatus,
    byClass,
  };
  if (!sessionId) {
    response.bySession = Object.values(bySession);
  }

  return NextResponse.json(response);
}
