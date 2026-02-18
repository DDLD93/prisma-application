"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/error-fallback";

export default function ParentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12">
      <ErrorFallback
        onReset={reset}
        homeHref="/"
        homeLabel="Back to dashboard"
        className="min-h-0 flex-1 justify-center"
      />
    </div>
  );
}
