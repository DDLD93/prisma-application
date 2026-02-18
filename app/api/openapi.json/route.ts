import { NextResponse } from "next/server";
import { openApiSpec } from "@/lib/swagger-spec";

export function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
