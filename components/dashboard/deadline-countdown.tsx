"use client";

import { useEffect, useState } from "react";

type DeadlineCountdownProps = {
  closeAt: string; // ISO date string
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

export function DeadlineCountdown({ closeAt }: DeadlineCountdownProps) {
  const [left, setLeft] = useState(() => getTimeLeft(new Date(closeAt)));

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft(getTimeLeft(new Date(closeAt)));
    }, 60_000); // update every minute
    return () => clearInterval(interval);
  }, [closeAt]);

  if (left.closed) {
    return (
      <p className="text-muted-foreground text-sm">
        Applications for this session have closed.
      </p>
    );
  }

  return (
    <p className="text-sm">
      <span className="font-medium">Application deadline:</span>{" "}
      <span className="text-muted-foreground">
        {left.days} day{left.days !== 1 ? "s" : ""}, {left.hours} hour
        {left.hours !== 1 ? "s" : ""}, {left.minutes} min left
      </span>
    </p>
  );
}
