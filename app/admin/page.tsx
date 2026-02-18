import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-muted-foreground">
        Manage application sessions, view applications and payments, and use
        analytics. Use the Admin API with the <code className="rounded bg-muted px-1">X-Admin-API-Key</code> header for
        programmatic access.
      </p>
      <Button asChild>
        <Link href="/api/admin/docs">Open API docs</Link>
      </Button>
    </div>
  );
}
