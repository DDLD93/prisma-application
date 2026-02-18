"use client";

import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";

const SwaggerUI = dynamic(
  () => import("swagger-ui-react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p className="p-4">Loading API docs...</p>,
  }
);

export default function AdminDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4">
        <h1 className="text-xl font-semibold mb-2">Admin API Documentation</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Use the <code className="rounded bg-muted px-1">X-Admin-API-Key</code> header to authenticate. You can set it via the Authorize button below.
        </p>
      </div>
      <SwaggerUI url="/api/openapi.json" />
    </div>
  );
}
