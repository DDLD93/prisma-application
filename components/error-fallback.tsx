"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  onReset?: () => void;
  /** Optional primary action href (e.g. "/" or "/login") */
  homeHref?: string;
  /** Label for home link */
  homeLabel?: string;
  /** Short message override */
  message?: string;
  className?: string;
}

export function ErrorFallback({
  onReset,
  homeHref,
  homeLabel = "Back to home",
  message = "Something went wrong. Please try again.",
  className,
}: ErrorFallbackProps) {
  return (
    <div
      className={
        className ??
        "relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-background p-4 text-center"
      }
    >
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-destructive/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-accent/30 blur-2xl" />
      <span className="inline-flex rounded-full border border-border bg-card p-3">
        <AlertTriangle className="size-5 text-destructive" />
      </span>
      <h1 className="text-2xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="max-w-sm text-muted-foreground">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <Button type="button" onClick={onReset}>
            Try again
          </Button>
        )}
        {homeHref && (
          <Button variant="outline" asChild>
            <Link href={homeHref}>{homeLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
