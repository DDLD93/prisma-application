import { Skeleton } from "@/components/ui/skeleton";

interface LoadingFallbackProps {
  /** "full" for full-page centered; "inline" for content-area only */
  variant?: "full" | "inline";
  className?: string;
}

export function LoadingFallback({
  variant = "full",
  className,
}: LoadingFallbackProps) {
  if (variant === "inline") {
    return (
      <div
        className={className}
        role="status"
        aria-label="Loading"
      >
        <div className="flex items-center gap-3">
          <div
            className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary"
            aria-hidden
          />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        className ??
        "relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-background p-4"
      }
      role="status"
      aria-label="Loading"
    >
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-accent/20 blur-2xl" />
      <div
        className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">Loading…</p>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
