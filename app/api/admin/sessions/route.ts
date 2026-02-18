import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const sessions = await prisma.applicationSession.findMany({
    orderBy: { year: "desc" },
  });
  return NextResponse.json(
    sessions.map((s) => ({
      id: s.id,
      year: s.year,
      openAt: s.openAt.toISOString(),
      closeAt: s.closeAt.toISOString(),
      amount: Number(s.amount),
      availableClasses: s.availableClasses,
      status: s.status,
    }))
  );
}

export async function POST(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;
  let body: {
    year: number;
    openAt: string;
    closeAt: string;
    amount: number;
    availableClasses?: string[];
    status?: "ACTIVE" | "INACTIVE" | "CONCLUDED";
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
  const { year, openAt, closeAt, amount, availableClasses, status } = body;
  if (year == null || !openAt || !closeAt || amount == null) {
    return NextResponse.json(
      { error: "Missing year, openAt, closeAt, or amount" },
      { status: 400 }
    );
  }
  const session = await prisma.applicationSession.create({
    data: {
      year: Number(year),
      openAt: new Date(openAt),
      closeAt: new Date(closeAt),
      amount,
      availableClasses: Array.isArray(availableClasses) ? availableClasses : [],
      status: status ?? "ACTIVE",
    },
  });
  return NextResponse.json({
    id: session.id,
    year: session.year,
    openAt: session.openAt.toISOString(),
    closeAt: session.closeAt.toISOString(),
    amount: Number(session.amount),
    availableClasses: session.availableClasses,
    status: session.status,
  });
}
