import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CompleteProfileForm } from "./complete-profile-form";

export default async function CompleteProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const hasName = !!session.user.name?.trim();
  const hasPhone = !!session.user.phone?.trim();
  if (hasName && hasPhone) redirect("/");

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Step 1 of 1
          </p>
          <div className="mt-2 h-2 rounded-full bg-muted">
            <div className="h-2 w-full rounded-full bg-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Complete your profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Please provide your full name and phone number to continue.
          </p>
        </div>
        <CompleteProfileForm
          defaultName={session.user.name ?? ""}
          defaultPhone={session.user.phone ?? ""}
        />
      </div>
    </div>
  );
}
