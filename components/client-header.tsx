import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

type ClientHeaderProps = {
  user: { name?: string | null; email?: string | null };
};

export function ClientHeader({ user }: ClientHeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center justify-between px-4">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-medium hover:underline">
            Home
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {user.email ?? user.name}
          </span>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
