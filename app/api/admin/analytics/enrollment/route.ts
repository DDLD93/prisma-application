import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getEnrollmentAnalytics } from "@/lib/analytics";

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const data = await getEnrollmentAnalytics();
  return NextResponse.json(data);
}
