"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressModal, type Step } from "@/components/progress-modal";

interface RegenerateDigestButtonProps {
  digestId: string;
  videoId: string;
}

export function RegenerateDigestButton({ digestId, videoId }: RegenerateDigestButtonProps) {
  const router = useRouter();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setCurrentStep("metadata");
    setError(null);

    try {
      const response = await fetch(`/api/digest/${digestId}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setCurrentStep(data.step);

            if (data.step === "error") {
              setError(data.message);
            } else if (data.step === "complete") {
              setTimeout(() => {
                setIsRegenerating(false);
                setShowConfirm(false);
                setCurrentStep(null);
                router.refresh();
              }, 500);
            }
          }
        }
      }
    } catch {
      setError("Failed to regenerate digest");
    }
  };

  const handleClose = () => {
    setIsRegenerating(false);
    setShowConfirm(false);
    setCurrentStep(null);
    setError(null);
  };

  if (showConfirm) {
    return (
      <>
        <ProgressModal
          isOpen={isRegenerating}
          title="Regenerating Digest"
          errorTitle="Regeneration Failed"
          icon={RefreshCw}
          iconSpins={true}
          currentStep={currentStep}
          error={error}
          onClose={handleClose}
        />
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[var(--color-text-tertiary)]" />
          <span className="text-sm text-[var(--color-text-secondary)]">Regenerate?</span>
          <button
            onClick={handleRegenerate}
            className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
          >
            No
          </button>
        </div>
      </>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="outline"
      size="icon-sm"
      className="text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-tertiary)]"
      title="Regenerate digest"
    >
      <RefreshCw className="w-4 h-4" />
    </Button>
  );
}
