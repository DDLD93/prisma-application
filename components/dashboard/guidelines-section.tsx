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
    <div className="rounded-lg border bg-muted/30 p-4">
      <h2 className="text-sm font-semibold mb-2">Application guidelines</h2>
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-3">
        {GUIDELINES.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      <p className="text-sm font-medium">
        Application fee: {currency}
        {amount.toFixed(2)}
      </p>
    </div>
  );
}
