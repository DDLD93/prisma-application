import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateAdmissionLetterPdfBuffer } from "@/lib/generate-admission-letter-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const application = await prisma.application.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: { session: true, admission: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!application.admission) {
    return NextResponse.json(
      { error: "No admission record for this application" },
      { status: 403 }
    );
  }

  try {
    const classForLetter =
      application.admission?.class ?? application.class ?? undefined;
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
