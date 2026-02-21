import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/70 bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/api/admin/docs" className="text-muted-foreground hover:text-foreground">
              API docs
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex-1 w-full max-w-6xl p-4">{children}</main>
    </div>
  );
}
