"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Check, Copy, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  digestId: string;
  isShared: boolean;
  slug: string | null;
  title: string;
}

export function ShareButton({ digestId, isShared: initialIsShared, slug: initialSlug, title }: ShareButtonProps) {
  const [isShared, setIsShared] = useState(initialIsShared);
  const [slug, setSlug] = useState(initialSlug);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const shareUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${slug}` : "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleShare = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/digest/${digestId}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isShared: !isShared, title }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsShared(data.isShared);
        setSlug(data.slug);
        if (data.isShared) {
          setShowPopover(true);
        }
      }
    } catch (error) {
      console.error("Failed to toggle share:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleButtonClick = () => {
    if (isShared) {
      setShowPopover(!showPopover);
    } else {
      handleToggleShare();
    }
  };

  return (
    <div className="relative flex items-center">
      <Button
        ref={buttonRef}
        onClick={handleButtonClick}
        disabled={isUpdating}
        variant="outline"
        size="icon-sm"
        className={isShared ? "text-[var(--color-accent)] border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-tertiary)]" : "text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-tertiary)]"}
        title={isShared ? "Manage sharing" : "Share digest"}
      >
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
      </Button>

      {showPopover && isShared && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 w-72 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-lg z-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              Share link
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] truncate"
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors shrink-0"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={handleToggleShare}
            disabled={isUpdating}
            className="w-full text-sm text-[var(--color-text-secondary)] hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Stop sharing"}
          </button>
        </div>
      )}
    </div>
  );
}
