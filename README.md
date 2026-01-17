# YouTube Video Digest CLI

Generate AI-powered summaries from YouTube videos. Transform long-form content into scannable, timestamped markdown documents.

## Features

- **Structured Summaries** - AI-generated topic sections with timestamp ranges and key takeaways
- **Smart Link Categorization** - Extracts URLs from descriptions/comments and sorts them into "Related" (resources, docs, tools) vs "Other" (social, sponsors)
- **Tangent Detection** - Off-topic segments (rants, extended sponsor reads) are separated so you know what's there without cluttering the main content
- **Organized Output** - Files saved to `outputs/{channel}/{title}.md`

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure API Keys

```bash
cp .env.example .env
```

Add your keys to `.env`:

- **Anthropic API Key**: https://console.anthropic.com/
- **YouTube Data API v3 Key**: Enable at https://console.cloud.google.com/ → APIs & Services → YouTube Data API v3

## Usage

```bash
pnpm digest <youtube-url>
```

Supports standard, short, and mobile YouTube URLs.

## Output

Digests are saved to `outputs/{channel-slug}/{title-slug}.md`

Each digest includes:
- Video metadata and a 2-3 sentence "At a Glance" summary
- Sections table with clickable timestamps
- Key points for each section (2-4 bullets synthesizing the content)
- Tangents section (if any off-topic segments detected)
- Categorized links from the video description

## Requirements

- Node.js 18+
- Anthropic API key
- YouTube Data API v3 key
- Videos must have captions enabled

## Roadmap

### Next: Web Application
- Interactive UI with video embed and clickable timestamps
- User accounts and saved digests
- Real-time processing with streaming updates
- Export options (PDF, Notion, Markdown)

### Future Enhancements
- Whisper API fallback for videos without captions
- Batch processing and playlist support
- Browser extension for one-click processing

## License

MIT
