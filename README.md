# YouTube Video Digest CLI

> **Note:** This is a proof-of-concept CLI tool built as the foundation for an upcoming web application. The modular architecture in `src/lib/` is designed to be reused in the future Next.js web version.

Generate AI-powered content summaries from YouTube videos with timestamps. Transform video content into scannable, organized markdown documents.

## Features

- **Structured Content Summaries** - AI-generated topic sections with timestamp ranges and key points
- **Smart Link Categorization** - Automatically extracts and categorizes URLs from video descriptions and comments:
  - **Related Links**: Documentation, tools, and resources mentioned in the video
  - **Other Links**: Social media, sponsors, and affiliate links
- **Video Transcript Extraction** - Fetches captions using youtube-transcript-plus (requires videos with captions)
- **Organized Output** - Files saved to `outputs/{channel}/{title}.md` for easy browsing
- **Powered by Claude Sonnet 4.5** - Uses structured output with Zod schemas for reliable parsing

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure API Keys

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

**Anthropic API Key** (for Claude AI):
- Get yours at: https://console.anthropic.com/

**YouTube Data API v3 Key**:
- Go to: https://console.cloud.google.com/
- Create a project or select an existing one
- Enable the "YouTube Data API v3"
- Create credentials (API Key)
- Copy the key to your `.env` file

## Usage

```bash
pnpm digest <youtube-url>
```

### Examples

```bash
# Standard YouTube URL
pnpm digest https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Short URL
pnpm digest https://youtu.be/dQw4w9WgXcQ

# Mobile URL
pnpm digest https://m.youtube.com/watch?v=dQw4w9WgXcQ
```

## Output

Digests are saved to:
```
outputs/{channel-slug}/{title-slug}.md
```

Example:
```
outputs/fireship/100-seconds-of-code-explained.md
```

The output includes:
- Video title, channel, duration, publish date
- AI-generated topic sections with timestamp ranges
- 2-4 bullet points per section summarizing key content
- Full markdown formatting for easy reading

## Requirements

- Node.js 18+
- Anthropic API key (Claude AI)
- YouTube Data API v3 key
- Videos must have captions/transcripts enabled

## Common Errors

### "No captions/transcript available"
The video doesn't have captions enabled. Try another video with auto-generated or manual captions.

### "Invalid YouTube API key"
Check that your `YOUTUBE_API_KEY` in `.env` is correct and that you've enabled the YouTube Data API v3 in Google Cloud Console.

### "YouTube API quota exceeded"
The free tier allows ~10,000 quota units per day. Wait 24 hours or create a new API key.

### "Invalid Anthropic API key"
Check that your `ANTHROPIC_API_KEY` in `.env` is correct. Get a key at https://console.anthropic.com/

## Architecture

This is a modular CLI package with a reusable library designed for future web UI integration:

```
youtube-digest/
├── src/
│   ├── cli.ts              # CLI wrapper (~100 lines)
│   └── lib/                # Reusable library modules (future Next.js integration)
│       ├── index.ts        # Barrel exports
│       ├── types.ts        # TypeScript interfaces (VideoMetadata, StructuredDigest, etc.)
│       ├── parser.ts       # URL parsing & video ID extraction
│       ├── transcript.ts   # Transcript fetching (youtube-transcript-plus)
│       ├── metadata.ts     # YouTube Data API integration (description, comments)
│       ├── url-extractor.ts # URL extraction from text
│       ├── summarize.ts    # Claude AI with structured output (Zod schemas)
│       └── formatter.ts    # Markdown rendering & file I/O
├── outputs/                # Generated digests (gitignored)
└── package.json
```

**Design Philosophy:**
- All core logic lives in `src/lib/` as pure, testable functions
- CLI wrapper (`src/cli.ts`) is minimal orchestration
- Functions are exported and ready for Next.js API routes
- Structured output (not plain text) enables interactive web UI features

## Tech Stack

- **TypeScript** - Strict mode for type safety
- **tsx** - TypeScript execution
- **youtube-transcript-plus** - Caption fetching without YouTube API quotas
- **@googleapis/youtube** - Video metadata (title, description, comments)
- **@ai-sdk/anthropic** - Claude Sonnet 4.5 integration
- **Vercel AI SDK** - Structured output with `generateObject()` + Zod schemas
- **Zod** - Schema validation for AI responses

## Roadmap

### Next: Web Application
The primary goal is to build a Next.js web application that reuses all `src/lib/` modules:
- Interactive UI with video embed and clickable timestamps
- User accounts and saved digests
- Real-time processing with streaming updates
- Export options (PDF, Notion, Markdown)

### Future Enhancements
- Whisper API fallback for videos without captions
- Batch processing and playlist support
- YouTube chapter detection integration
- Browser extension for one-click processing
- Unit tests with Vitest
- Related video discovery from verbal references

## License

MIT
