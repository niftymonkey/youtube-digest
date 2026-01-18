"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePictureUrl?: string | null;
  };
  signOutAction: () => Promise<void>;
}

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  email?: string
): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

function getDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  email?: string
): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  return email || "";
}

export function UserMenu({ user, signOutAction }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = getInitials(user.firstName, user.lastName, user.email);
  const displayName = getDisplayName(user.firstName, user.lastName, user.email);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 p-1 pr-2 rounded-full",
          "hover:bg-[var(--color-bg-secondary)] transition-colors",
          isOpen && "bg-[var(--color-bg-secondary)]"
        )}
      >
        {user.profilePictureUrl ? (
          <Image
            src={user.profilePictureUrl}
            alt={displayName}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-medium">
            {initials}
          </div>
        )}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[var(--color-text-secondary)] transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] shadow-md overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="font-medium text-[var(--color-text-primary)] truncate">
              {displayName}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] truncate">
              {user.email}
            </p>
          </div>

          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
