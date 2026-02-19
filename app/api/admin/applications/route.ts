import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const sessionId = searchParams.get("sessionId");
  const classFilter = searchParams.get("class");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );
  const sort = searchParams.get("sort") ?? "createdAt";
  const order = searchParams.get("order") ?? "desc";
  const skip = (page - 1) * limit;

  const where: Parameters<typeof prisma.application.findMany>[0]["where"] = {};
  if (status && ["SUBMITTED", "PAID", "COMPLETED"].includes(status)) {
    where.status = status as "SUBMITTED" | "PAID" | "COMPLETED";
  }
  if (sessionId) where.sessionId = sessionId;
  if (classFilter) where.class = classFilter;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  const orderByKey = sort === "createdAt" || sort === "updatedAt" ? sort : "createdAt";
  const orderBy = { [orderByKey]: order === "asc" ? "asc" as const : "desc" as const };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        session: true,
        payments: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  const data = applications.map((a) => ({
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
  }));

  return NextResponse.json({ data, total, page, limit });
}
