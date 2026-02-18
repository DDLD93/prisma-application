import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { generateApplicationPdfBuffer } from "@/lib/generate-application-pdf";

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
    include: { session: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const buffer = await generateApplicationPdfBuffer({
      wardName: application.wardName,
      wardDob: application.wardDob.toISOString().slice(0, 10),
      wardGender: application.wardGender,
      sessionYear: application.session.year,
      applicationId: application.id,
      class: application.class,
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="application-${id}.pdf"`,
      },
    });
  } catch (e) {
    console.error("PDF generation failed", e);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 }
    );
  }
}
