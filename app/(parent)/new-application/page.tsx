import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { NewApplicationForm } from "@/components/new-application-form";

export default async function NewApplicationPage() {
  const openSessions = await prisma.applicationSession.findMany({
    where: {
      openAt: { lte: new Date() },
      closeAt: { gte: new Date() },
    },
    orderBy: { year: "desc" },
  });

  const serializedSessions = openSessions.map((s) => ({
    id: s.id,
    year: s.year,
    amount: Number(s.amount),
    availableClasses: (s as unknown as { availableClasses: string[] }).availableClasses,
  }));

  if (openSessions.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-8 text-center">
        <h1 className="text-xl font-semibold">Start new application</h1>
        <p className="text-muted-foreground text-sm">
          No application sessions are currently open. Please check back later.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <div>
        <h1 className="text-xl font-semibold">Start new application</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Submit an enrollment application for your ward.
        </p>
      </div>
      <NewApplicationForm sessions={serializedSessions} />
    </div>
  );
}
