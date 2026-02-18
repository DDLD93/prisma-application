import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ClientHeader } from "@/components/client-header";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader user={session.user} />
      <main className="flex-1 container p-4">{children}</main>
    </div>
  );
}
