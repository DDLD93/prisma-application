import Link from "next/link";
import { Menu } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

type ClientHeaderProps = {
  user: { name?: string | null; email?: string | null };
};

export function ClientHeader({ user }: ClientHeaderProps) {
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Parent";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold tracking-tight">
            School Enrollment Platform
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            <Link href="/" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/new-application" className="hover:text-foreground">
              New Application
            </Link>
          </nav>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-2 py-1 text-sm">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {initials}
              </span>
              <span className="max-w-32 truncate">{displayName}</span>
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-3 shadow-lg">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email ?? "Signed in user"}
              </p>
              <form action={signOutAction} className="mt-3">
                <Button type="submit" variant="outline" size="sm" className="w-full">
                  Sign out
                </Button>
              </form>
            </div>
          </details>
        </div>
        <details className="relative md:hidden">
          <summary className="flex list-none items-center rounded-md border border-border bg-card p-2">
            <Menu className="size-4" />
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-3 shadow-lg">
            <div className="mb-3 border-b border-border pb-2">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="space-y-1">
              <Link href="/" className="block rounded-md px-2 py-1 text-sm hover:bg-muted">
                Dashboard
              </Link>
              <Link
                href="/new-application"
                className="block rounded-md px-2 py-1 text-sm hover:bg-muted"
              >
                New Application
              </Link>
            </div>
            <form action={signOutAction} className="mt-3">
              <Button type="submit" variant="outline" size="sm" className="w-full">
                Sign out
              </Button>
            </form>
          </div>
        </details>
      </div>
    </header>
  );
}
