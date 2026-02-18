import Link from "next/link";
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
        "flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4 text-center"
      }
    >
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">{message}</p>
      <Button asChild>
        <Link href={homeHref}>{homeLabel}</Link>
      </Button>
    </div>
  );
}
