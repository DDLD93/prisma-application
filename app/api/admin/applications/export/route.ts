import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const applications = await prisma.application.findMany({
    include: { session: true },
    orderBy: { createdAt: "desc" },
  });

  const header =
    "id,wardName,wardDob,wardGender,class,sessionYear,status,createdAt\n";
  const rows = applications.map(
    (a) =>
      `${a.id},${escapeCsv(a.wardName)},${a.wardDob.toISOString().slice(0, 10)},${escapeCsv(a.wardGender)},${escapeCsv(a.class ?? "")},${a.session.year},${a.status},${a.createdAt.toISOString()}`
  );
  const csv = header + rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=applications.csv",
    },
  });
}

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
