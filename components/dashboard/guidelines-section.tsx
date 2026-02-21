import { BadgeCheck } from "lucide-react";

type GuidelinesSectionProps = {
  amount: number;
  currency?: string;
};

const GUIDELINES = [
  "Submit one application per child for the selected session.",
  "Ensure all details are accurate before submission.",
  "Payment is required to complete your application.",
  "After payment you can download your receipt and, when available, your admission letter.",
];

export function GuidelinesSection({ amount, currency = "£" }: GuidelinesSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Application guidelines</h2>
        <span className="rounded-full bg-accent/30 px-3 py-1 text-sm font-medium">
          Fee: {currency}
          {amount.toFixed(2)}
        </span>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {GUIDELINES.map((line, i) => (
          <li key={i} className="flex items-start gap-2">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
