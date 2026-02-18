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
    <div className="mx-auto max-w-sm space-y-6 py-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Complete your profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Please provide your full name and phone number to continue.
        </p>
      </div>
      <CompleteProfileForm
        defaultName={session.user.name ?? ""}
        defaultPhone={session.user.phone ?? ""}
      />
    </div>
  );
}
