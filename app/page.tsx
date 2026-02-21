import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ClientHeader } from "@/components/client-header";
import { DeadlineCountdown } from "@/components/dashboard/deadline-countdown";
import { GuidelinesSection } from "@/components/dashboard/guidelines-section";
import { ApplicationsTable } from "@/components/applications-table";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingJourney } from "@/components/landing/journey";
import { LandingHighlights } from "@/components/landing/highlights";
import { LandingDatesBanner } from "@/components/landing/dates-banner";
import { LandingFaq } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";

export default async function HomePage() {
  const [session, openSessions] = await Promise.all([
    auth(),
    prisma.applicationSession.findMany({
      where: {
        openAt: { lte: new Date() },
        closeAt: { gte: new Date() },
      },
      orderBy: { year: "desc" },
    }),
  ]);

  const currentSession = openSessions[0] ?? null;

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <LandingNavbar />
        <LandingHero
          hasSession={!!currentSession}
          yearLabel={currentSession ? String(currentSession.year) : undefined}
        />
        <LandingJourney />
        <LandingHighlights />
        <LandingDatesBanner
          closeAt={currentSession?.closeAt.toISOString()}
          amount={currentSession ? Number(currentSession.amount) : undefined}
        />
        <LandingFaq />
        <LandingFooter />
      </div>
    );
  }

  const hasName = !!session.user.name?.trim();
  const hasPhone = !!session.user.phone?.trim();
  if (!hasName || !hasPhone) {
    redirect("/complete-profile");
  }

  const applicationsRaw = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      session: true,
      payments: true,
      admission: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const applications = applicationsRaw.map((app) => ({
    id: app.id,
    status: app.status,
    wardName: app.wardName,
    class: (app as unknown as { class: string }).class,
    session: {
      year: app.session.year,
      amount: Number(app.session.amount),
    },
    payments: app.payments.map((p) => ({ id: p.id, status: p.status })),
    admission: app.admission
      ? { id: app.admission.id, status: app.admission.status }
      : null,
  }));

  const pendingPayments = applications.filter((app) =>
    app.payments.some((p) => p.status === "PENDING")
  ).length;
  const admissionsOffered = applications.filter(
    (app) => app.admission?.status === "OFFERED"
  ).length;

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader user={session.user} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {session.user.name?.split(" ")[0] ?? "Parent"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Review your application progress, keep an eye on deadlines, and
            complete next steps from one place.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-border bg-secondary p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total applications
            </p>
            <p className="mt-2 text-3xl font-semibold">{applications.length}</p>
          </article>
          <article className="rounded-xl border border-border bg-accent/25 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Pending payments
            </p>
            <p className="mt-2 text-3xl font-semibold">{pendingPayments}</p>
          </article>
          <article className="rounded-xl border border-border bg-primary/10 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Admissions offered
            </p>
            <p className="mt-2 text-3xl font-semibold">{admissionsOffered}</p>
          </article>
        </section>

        {currentSession && (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <DeadlineCountdown closeAt={currentSession.closeAt.toISOString()} />
          </section>
        )}

        {currentSession && (
          <GuidelinesSection amount={Number(currentSession.amount)} />
        )}

        {openSessions.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Start application</h2>
                <p className="text-sm text-muted-foreground">
                  Submit a new application for an open enrollment session.
                </p>
              </div>
              <Button asChild>
                <Link href="/new-application">Start new application</Link>
              </Button>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">Your applications</h2>
            <p className="text-sm text-muted-foreground">
              Track status, payment, and admission actions.
            </p>
          </div>
          <ApplicationsTable applications={applications} />
        </section>
      </main>
    </div>
  );
}
