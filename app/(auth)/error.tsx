"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/error-fallback";

export default function AuthError({
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
    <ErrorFallback
      onReset={reset}
      homeHref="/login"
      homeLabel="Back to sign in"
    />
  );
}
