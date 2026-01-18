"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteDigestButtonProps {
  digestId: string;
}

export function DeleteDigestButton({ digestId }: DeleteDigestButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/digest/${digestId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/digests");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete digest");
      }
    } catch (error) {
      alert("Failed to delete digest");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--color-text-secondary)]">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1 text-[var(--color-text-tertiary)] hover:text-red-500 transition-colors text-sm"
      title="Delete digest"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
