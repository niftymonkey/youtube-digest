"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressModal, type Step } from "@/components/progress-modal";

interface UrlInputProps {
  onDigestComplete: (digestId: string) => void;
}

export function UrlInput({ onDigestComplete }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCurrentStep(null);

    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    const isYouTubeUrl = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/
    );

    if (!isYouTubeUrl) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);
    setCurrentStep("metadata");

    try {
      const response = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to create digest");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setCurrentStep(data.step);

            if (data.step === "error") {
              setError(data.message);
            }

            if (data.step === "complete" && data.data?.digestId) {
              setTimeout(() => {
                setIsLoading(false);
                setCurrentStep(null);
                setUrl("");
                onDigestComplete(data.data.digestId);
              }, 500);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    setCurrentStep(null);
    setError(null);
  };

  // Validation errors (shown inline)
  const isValidationError = error && (
    error === "Please enter a YouTube URL" ||
    error === "Please enter a valid YouTube URL"
  );

  return (
    <>
      <ProgressModal
        isOpen={isLoading}
        title="Creating Digest"
        errorTitle="Failed to Create Digest"
        icon={Youtube}
        currentStep={currentStep}
        error={error}
        onClose={handleClose}
      />

      {/* URL Input Form */}
      <div className="w-full max-w-xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="relative group">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="Paste a YouTube URL..."
              disabled={isLoading}
              className={cn(
                "w-full px-5 py-3.5 text-lg",
                "bg-[var(--color-bg-secondary)] border rounded-xl",
                "placeholder:text-[var(--color-text-tertiary)]",
                "focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20",
                "transition-all duration-200",
                "group-hover:border-[var(--color-border-hover)]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                isValidationError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[var(--color-border)]"
              )}
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className={cn(
                "absolute right-1.5 top-1.5 bottom-1.5",
                "px-4 rounded-lg bg-[var(--color-accent)] text-white cursor-pointer",
                "flex items-center justify-center",
                "hover:bg-[var(--color-accent-hover)] transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>
          {isValidationError && (
            <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
          )}
        </form>
      </div>
    </>
  );
}
