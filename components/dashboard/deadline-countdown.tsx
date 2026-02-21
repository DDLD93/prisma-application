"use client";

import { useEffect, useState } from "react";

type DeadlineCountdownProps = {
  closeAt: string; // ISO date string
  compact?: boolean;
};

function getTimeLeft(closeAt: Date): { days: number; hours: number; minutes: number; closed: boolean } {
  const now = new Date();
  const end = new Date(closeAt);
  if (end <= now) {
    return { days: 0, hours: 0, minutes: 0, closed: true };
  }
  const diff = end.getTime() - now.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  return { days, hours, minutes, closed: false };
}

export function DeadlineCountdown({ closeAt, compact = false }: DeadlineCountdownProps) {
  const [left, setLeft] = useState(() => getTimeLeft(new Date(closeAt)));

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft(getTimeLeft(new Date(closeAt)));
    }, 60_000); // update every minute
    return () => clearInterval(interval);
  }, [closeAt]);

  if (left.closed) {
    return (
      <p className="text-sm text-muted-foreground">
        Applications for this session have closed.
      </p>
    );
  }

  if (compact) {
    return (
      <p className="text-sm">
        <span className="font-medium">Deadline in:</span>{" "}
        <span className="text-muted-foreground">
          {left.days}d {left.hours}h {left.minutes}m
        </span>
      </p>
    );
  }

  const urgencyClass =
    left.days <= 2
      ? "border-destructive/40 bg-destructive/10"
      : left.days <= 7
      ? "border-accent/40 bg-accent/20"
      : "border-primary/30 bg-primary/10";

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">
        Application deadline
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={`rounded-xl border p-4 ${urgencyClass}`}>
          <p className="text-3xl font-semibold">{left.days}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Days</p>
        </div>
        <div className={`rounded-xl border p-4 ${urgencyClass}`}>
          <p className="text-3xl font-semibold">{left.hours}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Hours</p>
        </div>
        <div className={`rounded-xl border p-4 ${urgencyClass}`}>
          <p className="text-3xl font-semibold">{left.minutes}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Minutes</p>
        </div>
      </div>
    </div>
  );
}
