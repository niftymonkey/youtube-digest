"use client";

import * as React from "react";
import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseTimestamp } from "./timestamp";
import type { ContentSection, Tangent, KeyPoint } from "@/lib/types";

interface SectionAccordionProps {
  sections: ContentSection[];
  videoId: string;
  tangents?: Tangent[];
}

type ContentItem =
  | { type: "keypoint"; text: string; timestamp?: number }
  | { type: "tangent"; tangent: Tangent; index: number };

function isKeyPointArray(keyPoints: KeyPoint[] | string[]): keyPoints is KeyPoint[] {
  return keyPoints.length > 0 && typeof keyPoints[0] === "object";
}

function getTangentsInSection(
  section: ContentSection,
  tangents: Tangent[],
  nextSectionStart?: number
): Array<{ tangent: Tangent; index: number }> {
  const sectionStart = parseTimestamp(section.timestampStart);
  // Use next section's start time if available, otherwise use this section's end time
  const sectionEnd = nextSectionStart ?? parseTimestamp(section.timestampEnd);

  return tangents
    .map((tangent, index) => ({ tangent, index }))
    .filter(({ tangent }) => {
      const tangentStart = parseTimestamp(tangent.timestampStart);
      return tangentStart >= sectionStart && tangentStart < sectionEnd;
    });
}

function buildInterleavedContent(
  section: ContentSection,
  sectionTangents: Array<{ tangent: Tangent; index: number }>
): ContentItem[] {
  const items: ContentItem[] = [];

  if (isKeyPointArray(section.keyPoints)) {
    // New format with timestamps - interleave tangents
    const keyPointItems: ContentItem[] = section.keyPoints.map((kp) => ({
      type: "keypoint" as const,
      text: kp.text,
      timestamp: parseTimestamp(kp.timestamp),
    }));

    const tangentItems: ContentItem[] = sectionTangents.map(({ tangent, index }) => ({
      type: "tangent" as const,
      tangent,
      index,
    }));

    // Merge and sort by timestamp
    const allItems = [...keyPointItems, ...tangentItems];
    allItems.sort((a, b) => {
      const aTime = a.type === "keypoint" ? (a.timestamp ?? 0) : parseTimestamp(a.tangent.timestampStart);
      const bTime = b.type === "keypoint" ? (b.timestamp ?? 0) : parseTimestamp(b.tangent.timestampStart);
      return aTime - bTime;
    });

    return allItems;
  } else {
    // Legacy format - keypoints first, then tangents at end
    section.keyPoints.forEach((text) => {
      items.push({ type: "keypoint", text });
    });
    sectionTangents.forEach(({ tangent, index }) => {
      items.push({ type: "tangent", tangent, index });
    });
    return items;
  }
}

function TimestampLink({
  time,
  videoId
}: {
  time: string;
  videoId: string;
}) {
  const seconds = parseTimestamp(time);
  const url = `https://youtube.com/watch?v=${videoId}&t=${seconds}s`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "font-mono text-sm",
        "text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]",
        "transition-colors"
      )}
    >
      {time}
    </a>
  );
}

export function SectionAccordion({ sections, videoId, tangents = [] }: SectionAccordionProps) {
  const allSectionValues = sections.map((_, index) => `section-${index}`);
  const [openSections, setOpenSections] = useState<string[]>([]);

  const allExpanded = openSections.length === sections.length;

  const toggleAll = () => {
    if (allExpanded) {
      setOpenSections([]);
    } else {
      setOpenSections(allSectionValues);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button
          onClick={toggleAll}
          className="inline-flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          <ChevronsUpDown className="w-3 h-3" />
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <AccordionPrimitive.Root
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="space-y-2"
      >
        {sections.map((section, index) => {
        const nextSection = sections[index + 1];
        const nextSectionStart = nextSection ? parseTimestamp(nextSection.timestampStart) : undefined;
        const sectionTangents = getTangentsInSection(section, tangents, nextSectionStart);

        return (
          <AccordionPrimitive.Item
            key={index}
            value={`section-${index}`}
            className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]"
          >
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 md:px-4 md:py-3",
                  "text-left font-medium text-[var(--color-text-primary)]",
                  "hover:bg-[var(--color-bg-tertiary)] transition-colors",
                  "group"
                )}
              >
                <div className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] transition-transform group-data-[state=open]:rotate-90" />
                  <span>{section.title}</span>
                </div>
                <TimestampLink
                  time={section.timestampStart}
                  videoId={videoId}
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>

            <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
              <div className="px-3 pb-3 pt-1 md:px-4 md:pb-4 md:pt-2">
                <ul className="space-y-2">
                  {buildInterleavedContent(section, sectionTangents).map((item, itemIndex) =>
                    item.type === "keypoint" ? (
                      <li
                        key={`kp-${itemIndex}`}
                        className="text-[var(--color-text-primary)] list-disc list-outside ml-4"
                      >
                        {item.text}
                      </li>
                    ) : (
                      <li
                        key={`tangent-${item.index}`}
                        className="text-[var(--color-text-secondary)] list-disc list-outside ml-4 italic"
                      >
                        <a
                          href={`#tangent-${item.index}`}
                          className="hover:text-[var(--color-accent)] transition-colors"
                        >
                          Tangent: {item.tangent.title} ({item.tangent.timestampStart} - {item.tangent.timestampEnd})
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        );
        })}
      </AccordionPrimitive.Root>
    </div>
  );
}
