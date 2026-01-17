/**
 * Extracts the YouTube video ID from various URL formats
 *
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&t=123
 *
 * @param url - YouTube URL to parse
 * @returns Video ID or null if invalid
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    // Standard: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    // Short: youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([^&\n?#]+)/,
    // Mobile: m.youtube.com/watch?v=VIDEO_ID
    /(?:m\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
    // Embed: youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}
