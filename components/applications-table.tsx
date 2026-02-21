"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { simulatePayment } from "@/actions/applications";

type App = {
  id: string;
  status: string;
  wardName: string;
  class: string;
  session: { year: number; amount: number };
  payments: { id: string; status: string }[];
  admission?: { id: string; status: string } | null;
};

export function ApplicationsTable({
  applications,
}: {
  applications: App[];
}) {
  const router = useRouter();

  async function handlePay(applicationId: string) {
    await simulatePayment(applicationId);
    router.refresh();
  }

  if (applications.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No applications yet. Start one to apply for a session.
      </p>
    );
  }

  function statusStyles(status: string) {
    if (status === "COMPLETED") return "bg-emerald-100 text-emerald-800";
    if (status === "PAID") return "bg-amber-100 text-amber-800";
    if (status === "SUBMITTED") return "bg-teal-100 text-teal-800";
    return "bg-muted text-muted-foreground";
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 md:hidden">
        {applications.map((app) => {
          const payment = app.payments[0];
          const amount = app.session.amount;
          return (
            <article key={app.id} className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{app.wardName}</p>
                  <p className="text-sm text-muted-foreground">
                    {app.class} • {app.session.year}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles(app.status)}`}>
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Payment: {payment?.status === "COMPLETED" ? "Paid" : `Pending (${amount})`}
              </p>
              <p className="text-sm text-muted-foreground">
                Admission: {app.admission?.status ?? "—"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {app.status === "SUBMITTED" && payment?.status === "PENDING" && (
                  <Button size="sm" variant="outline" onClick={() => handlePay(app.id)}>
                    Pay (simulate)
                  </Button>
                )}
                {(app.status === "PAID" || app.status === "COMPLETED") && (
                  <Button size="sm" variant="link" asChild className="h-auto p-0">
                    <a href={`/api/applications/${app.id}/form`} download>
                      Print PDF receipt
                    </a>
                  </Button>
                )}
                {app.admission && (
                  <Button size="sm" variant="link" asChild className="h-auto p-0">
                    <a href={`/api/applications/${app.id}/admission-letter`} download>
                      Print admission letter
                    </a>
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Child name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Session (year)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Admission</TableHead>
              <TableHead className="w-[180px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              const payment = app.payments[0];
              const amount = app.session.amount;
              return (
                <TableRow key={app.id}>
                  <TableCell>{app.wardName}</TableCell>
                  <TableCell>{app.class}</TableCell>
                  <TableCell>{app.session.year}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles(app.status)}`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment?.status === "COMPLETED" ? "Paid" : `Pending (${amount})`}
                  </TableCell>
                  <TableCell>{app.admission?.status ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {app.status === "SUBMITTED" && payment?.status === "PENDING" && (
                        <Button size="sm" variant="outline" onClick={() => handlePay(app.id)}>
                          Pay (simulate)
                        </Button>
                      )}
                      {(app.status === "PAID" || app.status === "COMPLETED") && (
                        <Button size="sm" variant="link" asChild className="h-auto p-0">
                          <a href={`/api/applications/${app.id}/form`} download>
                            Print PDF receipt
                          </a>
                        </Button>
                      )}
                      {app.admission && (
                        <Button size="sm" variant="link" asChild className="h-auto p-0">
                          <a href={`/api/applications/${app.id}/admission-letter`} download>
                            Print admission letter
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
