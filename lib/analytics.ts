import { prisma } from "@/lib/prisma";

function getAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export async function getEnrollmentAnalytics() {
  const [applicationsByDob, genderRatio, conversion] = await Promise.all([
    prisma.application.findMany({ select: { wardDob: true } }),
    prisma.application.groupBy({
      by: ["wardGender"],
      _count: true,
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const buckets = [
    { label: "0-5", min: 0, max: 5 },
    { label: "6-10", min: 6, max: 10 },
    { label: "11-15", min: 11, max: 15 },
    { label: "16+", min: 16, max: 120 },
  ];
  const ageBuckets = buckets.map((b) => ({
    bucket: b.label,
    count: applicationsByDob.filter((a) => {
      const age = getAge(a.wardDob);
      return age >= b.min && age <= b.max;
    }).length,
  }));

  const gender = genderRatio.map((g) => ({
    gender: g.wardGender,
    count: g._count,
  }));

  const submitted = conversion.find((c) => c.status === "SUBMITTED")?._count ?? 0;
  const paid = conversion.find((c) => c.status === "PAID")?._count ?? 0;
  const conversionRate =
    submitted > 0 ? Math.round((paid / submitted) * 100) : 0;

  return {
    ageBuckets,
    gender,
    conversion: { submitted, paid, conversionRatePercent: conversionRate },
  };
}

export async function getFinancialAnalytics() {
  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
    include: {
      application: { include: { session: true } },
    },
  });

  const bySession = new Map<
    string,
    { year: number; total: number; system: number; apiOverride: number }
  >();

  for (const p of payments) {
    const sid = p.application.sessionId;
    const year = p.application.session.year;
    if (!bySession.has(sid)) {
      bySession.set(sid, { year, total: 0, system: 0, apiOverride: 0 });
    }
    const entry = bySession.get(sid)!;
    entry.total += Number(p.amount);
    if (p.verifiedBy === "SYSTEM") entry.system += Number(p.amount);
    else if (p.verifiedBy === "API_OVERRIDE") entry.apiOverride += Number(p.amount);
  }

  const sessions = Array.from(bySession.entries()).map(([id, data]) => ({
    sessionId: id,
    year: data.year,
    total: data.total,
    verifiedBySystem: data.system,
    verifiedByApiOverride: data.apiOverride,
  }));

  return { sessions };
}
