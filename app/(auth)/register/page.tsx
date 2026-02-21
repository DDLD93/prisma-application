import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-lg lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-accent/20 p-10 lg:block">
          <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-primary/20 blur-2xl" />
          <div className="absolute -bottom-10 right-0 h-52 w-52 rounded-full bg-accent/40 blur-2xl" />
          <div className="relative z-10 space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
              <NotebookPen className="size-3.5 text-primary" />
              New parent account
            </p>
            <h1 className="max-w-sm text-4xl font-semibold tracking-tight">
              Create your enrollment account in under a minute.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Once registered, you can submit applications, track updates, and
              download official documents from your dashboard.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Create account</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Register with email and password.
              </p>
            </div>
            <RegisterForm />
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
