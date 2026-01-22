"use client";

import { useRouter } from "next/navigation";
import { UrlInput } from "@/components/url-input";

export function UnifiedDashboard() {
  const router = useRouter();

  const handleDigestComplete = (digestId: string) => {
    router.push(`/digest/${digestId}`);
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-4 py-4">
      <h1 className="text-2xl md:text-3xl font-heading text-[var(--color-text-primary)] font-semibold tracking-tight">
        What are you watching?
      </h1>

      <UrlInput onDigestComplete={handleDigestComplete} />
    </div>
  );
}
