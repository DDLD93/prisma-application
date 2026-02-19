import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type AdmissionInput = {
  applicationId: string;
  class?: string | null;
  status?: "PENDING" | "OFFERED" | "ACCEPTED" | "DECLINED";
};

export async function POST(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  let body: { admissions: AdmissionInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { admissions } = body;
  if (!Array.isArray(admissions)) {
    return NextResponse.json(
      { error: "Body must contain an array 'admissions'" },
      { status: 400 }
    );
  }

  const results: { id: string; applicationId: string }[] = [];
  const errors: { applicationId: string; error: string }[] = [];

  for (const item of admissions) {
    const { applicationId, class: className, status } = item;
    if (!applicationId) {
      errors.push({ applicationId: "(missing)", error: "applicationId is required" });
      continue;
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { admission: true },
    });
    if (!application) {
      errors.push({ applicationId, error: "Application not found" });
      continue;
    }
    if (application.admission) {
      errors.push({ applicationId, error: "Application already has an admission" });
      continue;
    }

    try {
      const admission = await prisma.admission.create({
        data: {
          applicationId,
          class: className ?? undefined,
          status: status ?? "PENDING",
        },
      });
      results.push({ id: admission.id, applicationId });
    } catch (e) {
      errors.push({
        applicationId,
        error: e instanceof Error ? e.message : "Create failed",
      });
    }
  }

  return NextResponse.json({
    created: results,
    errors: errors.length ? errors : undefined,
  });
}
