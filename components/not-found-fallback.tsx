import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotFoundFallbackProps {
  /** Primary CTA href (e.g. "/" or "/login") */
  homeHref?: string;
  /** Primary CTA label */
  homeLabel?: string;
  /** Optional short message */
  message?: string;
  className?: string;
}

export function NotFoundFallback({
  homeHref = "/",
  homeLabel = "Back to home",
  message = "The page you're looking for doesn't exist or was moved.",
  className,
}: NotFoundFallbackProps) {
  return (
    <div
      className={
        className ??
        "relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-background p-4 text-center"
      }
    >
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-accent/20 blur-2xl" />
      <span className="inline-flex rounded-full border border-border bg-card p-3">
        <Compass className="size-5 text-primary" />
      </span>
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">{message}</p>
      <Button asChild>
        <Link href={homeHref}>{homeLabel}</Link>
      </Button>
    </div>
  );
}
