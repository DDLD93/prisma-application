import Link from "next/link";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; registered?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");

  const params = await searchParams;
  const showVerified = params.verified === "1";
  const showRegistered = params.registered === "1";

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-lg lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-primary/10 p-10 lg:block">
          <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-primary/25 blur-xl" />
          <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-accent/30 blur-xl" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Parent Portal
              </p>
              <h1 className="max-w-sm text-4xl font-semibold tracking-tight">
                Welcome back to your family enrollment dashboard.
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Sign in to manage applications, complete payments, and download
                admission letters in one place.
              </p>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use your email or Google to continue.
              </p>
            </div>
            {showVerified && (
              <p className="rounded-md bg-green-500/10 px-3 py-2 text-center text-sm text-green-700 dark:text-green-400">
                Email verified. You can sign in now.
              </p>
            )}
            {showRegistered && (
              <p className="rounded-md bg-green-500/10 px-3 py-2 text-center text-sm text-green-700 dark:text-green-400">
                Account created. Please verify your email, then sign in.
              </p>
            )}
            <Suspense
              fallback={
                <div className="text-sm text-muted-foreground">Loading…</div>
              }
            >
              <LoginForm />
            </Suspense>
            <p className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link href="/register" className="text-primary underline">
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
