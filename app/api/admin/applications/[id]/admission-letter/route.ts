import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { generateAdmissionLetterPdfBuffer } from "@/lib/generate-admission-letter-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { session: true, admission: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (!application.admission) {
    return NextResponse.json(
      { error: "No admission record for this application" },
      { status: 403 }
    );
  }

  try {
    const classForLetter =
      application.admission.class ?? application.class ?? undefined;
    const buffer = await generateAdmissionLetterPdfBuffer({
      wardName: application.wardName,
      sessionYear: application.session.year,
      applicationId: application.id,
      admissionStatus: application.admission.status,
      class: classForLetter,
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="admission-letter-${id}.pdf"`,
      },
    });
  } catch (e) {
    console.error("Admission letter PDF generation failed", e);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 }
    );
  }
}
