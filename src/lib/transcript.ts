import { Supadata } from "@supadata/js";
import type { TranscriptEntry } from "./types";

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY!,
});

/**
 * Fetches the transcript for a YouTube video using Supadata API
 *
 * @param videoId - YouTube video ID
 * @returns Array of transcript entries with timestamps
 * @throws Error if captions are disabled or unavailable
 */
export async function fetchTranscript(
  videoId: string
): Promise<TranscriptEntry[]> {
  const startTime = Date.now();
  console.log(`[TRANSCRIPT] Starting fetch for videoId: ${videoId}`);

  try {
    const result = await supadata.youtube.transcript({
      videoId,
    });

    // Handle async job case (unlikely for YouTube but SDK supports it)
    if ("jobId" in result) {
      throw new Error("Transcript generation queued - not supported yet");
    }

    // Handle case where content is a string (no timestamps)
    if (typeof result.content === "string") {
      throw new Error(
        "Transcript returned without timestamps - cannot process"
      );
    }

    console.log(
      `[TRANSCRIPT] Success in ${Date.now() - startTime}ms, entries: ${result.content.length}`
    );

    // Convert to our TranscriptEntry format
    // Supadata returns offset/duration in milliseconds, we need seconds
    return result.content.map((entry) => ({
      text: entry.text,
      offset: entry.offset / 1000,
      duration: entry.duration / 1000,
      lang: result.lang,
    }));
  } catch (error: unknown) {
    console.error(`[TRANSCRIPT] Failed in ${Date.now() - startTime}ms:`, error);

    const errorMsg =
      error instanceof Error ? error.message?.toLowerCase() : "";

    if (errorMsg.includes("disabled") || errorMsg.includes("not available")) {
      throw new Error(
        "No captions/transcript available for this video. Try a video with auto-generated or manual captions."
      );
    }

    if (errorMsg.includes("unavailable")) {
      throw new Error("Video is unavailable or has been removed");
    }

    if (errorMsg.includes("invalid")) {
      throw new Error("Invalid video ID");
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch transcript: ${message}`);
  }
}
