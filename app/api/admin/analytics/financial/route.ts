import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getFinancialAnalytics } from "@/lib/analytics";

export async function GET(request: Request) {
  const auth = await validateAdminRequest(request);
  if (!auth.ok) return auth.response;

  const data = await getFinancialAnalytics();
  return NextResponse.json(data);
}
