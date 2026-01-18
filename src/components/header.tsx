import Link from "next/link";
import { withAuth, signOut } from "@workos-inc/authkit-nextjs";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { Youtube } from "lucide-react";

async function signOutAction() {
  "use server";
  await signOut();
}

export async function Header() {
  const { user } = await withAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg-primary)]/80">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors">
          <Youtube className="w-5 h-5" />
          <span className="font-semibold">YouTube Digest</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/digests"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Browse
          </Link>
          {user && (
            <UserMenu
              user={{
                email: user.email ?? "",
                firstName: user.firstName,
                lastName: user.lastName,
                profilePictureUrl: user.profilePictureUrl,
              }}
              signOutAction={signOutAction}
            />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
