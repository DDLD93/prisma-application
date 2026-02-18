import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between px-4">
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/api/admin/docs" className="text-muted-foreground hover:text-foreground hover:underline">
              API docs
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container p-4">{children}</main>
    </div>
  );
}
