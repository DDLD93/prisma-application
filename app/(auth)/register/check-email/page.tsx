import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ResendVerificationForm } from "./resend-form";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <span className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-3">
          <MailCheck className="size-5 text-primary" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a verification link to{" "}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            "your email"
          )}
          . Click the link in that email to verify your account, then sign in.
        </p>
        <div className="mt-6 space-y-3">
          <Suspense fallback={null}>
            {email && <ResendVerificationForm email={email} />}
          </Suspense>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
