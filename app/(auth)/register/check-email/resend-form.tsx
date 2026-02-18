"use client";

import { useState } from "react";
import { resendVerification } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function ResendVerificationForm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );

  async function handleResend() {
    setStatus("loading");
    const result = await resendVerification(email);
    if (result?.error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full"
        disabled={status === "loading" || status === "sent"}
        onClick={handleResend}
      >
        {status === "loading"
          ? "Sending…"
          : status === "sent"
            ? "Link sent again"
            : "Resend verification email"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-destructive">
          Could not resend. You may already be verified — try signing in.
        </p>
      )}
    </div>
  );
}
