# ClearBridge

**Accessibility-first information access for people with vision or hearing disabilities.**

ClearBridge transforms live speech and uploaded content into personalized, structured accessible output — live captions, smart summaries, key points, action items, deadline extraction, image descriptions, and read-aloud support — adapted to the user's specific accessibility need.

---

## Quick Start

### 1. Prerequisites

- **Node.js 18+** — install via [nvm](https://github.com/nvm-sh/nvm) or [nodejs.org](https://nodejs.org)
- **Google Chrome** — required for Live Mic mode (Web Speech API)
- **OpenAI API key** — get one free at [platform.openai.com](https://platform.openai.com/api-keys)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your API key

Open `.env.local` and replace the placeholder:

```
OPENAI_API_KEY=your_actual_key_here
```

> **Cost note:** GPT-4o-mini costs ~$0.15/1M input tokens. A full demo session costs fractions of a cent.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3456](http://localhost:3456) in **Google Chrome** or Cursor’s **Simple Browser**. This project uses port **3456** on purpose so it does not fight with other apps that use `3000`.

If you see **ERR_CONNECTION_REFUSED**, the dev server is not running: in a terminal, `cd` into the `clearbridge` folder, run `npm run dev`, wait until you see **Ready**, then reload the page. If port 3456 is ever in use, stop the other process or run `npm run dev -- -p <port>` and open that URL instead.

---

## Features

### Accessibility Modes
Select your mode before starting — the entire interface adapts:

| Mode | Optimized for |
|------|--------------|
| **Hearing Support** | Live captions, key points first, action items, deadlines |
| **Vision Support** | Read aloud, large text, high contrast, image descriptions |
| **Dual Support** | Full combination of both |

### Live Session Mode
1. Select your accessibility mode
2. Click the microphone button to start recording
3. See real-time captions as you speak
4. Click Stop, then **Process & View Results**
5. Get a fully structured accessibility dashboard

### Upload Mode
Supports:
- **PDF** documents (text extraction)
- **Images** (JPG, PNG, WebP, GIF) — AI-powered image description
- **Audio files** (MP3, WAV, M4A, OGG) — Whisper transcription
- **Plain text** (.txt)

### Results Dashboard
- **Summary** — 2-3 sentence overview
- **Simplified Explanation** — clearer language, same meaning
- **Key Points** — most important information
- **Action Items** — tasks, homework, instructions
- **Dates & Deadlines** — all time references extracted
- **Image Descriptions** — plain-language visual descriptions
- **Full Text** — complete transcript or extracted content

### Proactive Insights Panel
Automatically surfaces: "5 action items found", "3 dates detected", "Simplified version ready" — without the user needing to ask.

### Accessibility Controls
- **High Contrast** toggle (Vision/Dual modes enable by default)
- **Large Text** toggle (Vision/Dual modes enable by default)
- **Read Aloud** on every section (auto-starts in Vision/Dual modes)
- **Save Session** — persists results locally in browser storage
- **Export** — download as plain text or JSON file
- Keyboard navigation throughout
- ARIA labels on all interactive elements
- Skip-to-content link

---

## Demo Flow (Competition)

1. Open [http://localhost:3456](http://localhost:3456) in Chrome (see Quick Start)
2. Note the **Hearing Support** mode is selected by default
3. Click **Start Live Session** → speak a sample lecture passage
4. Click Stop → click **Pr4ocess & View Results**
5. Show the structured dashboard: Key Points tab, Action Items tab, Insight Panel
6. Go back, switch to **Vision Support** mode
7. Click **Upload Content** → upload a PDF
8. Show how the layout changes: Summary first, large text, read-aloud auto-starts
9. Toggle High Contrast to demonstrate the accessibility controls
10. Use the **Load Demo** button at any time for a reliable fallback

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (persisted) |
| Live Transcription | Web Speech API (browser-native, free) |
| AI Processing | OpenAI GPT-4o-mini |
| Audio Transcription | OpenAI Whisper API |
| PDF Extraction | pdf-parse |
| Image Description | OpenAI GPT-4o-mini (vision) |
| Read Aloud | SpeechSynthesis API (browser-native, free) |

---

## Project Structure

```
clearbridge/
├── app/                    # Next.js App Router pages + API routes
│   ├── page.tsx            # Home page
│   ├── session/page.tsx    # Live mic session
│   ├── upload/page.tsx     # File upload
│   ├── results/page.tsx    # Results dashboard
│   ├── sessions/page.tsx   # Saved sessions list
│   └── api/                # Backend route handlers
├── components/             # React components
│   ├── accessibility/      # A11y controls, read aloud
│   ├── home/               # Hero, action cards
│   ├── layout/             # Header, theme provider
│   ├── mode/               # Mode selector
│   ├── results/            # Dashboard, tabs, views
│   ├── session/            # Mic button, live transcript
│   ├── ui/                 # Button, Card, Badge, Spinner
│   └── upload/             # File dropzone, preview
├── lib/
│   ├── ai/                 # Prompts, response parser
│   ├── speech/             # Web Speech API wrapper
│   ├── tts/                # SpeechSynthesis wrapper
│   ├── demo-data.ts        # Pre-computed demo results
│   ├── mode-adapter.ts     # Mode → UI config mapping
│   └── storage.ts          # Export utilities
├── store/app-store.ts      # Zustand global state
└── types/index.ts          # TypeScript interfaces
```

---

## Notes

- **Dev URL:** `npm run dev` serves at **http://localhost:3456** (not `3000`), so Cursor’s browser tab or bookmarks should use that port.
- **Chrome required** for Live Mic mode. Safari and Firefox do not support the Web Speech API.
- The **Load Demo** button in both Session and Upload pages always works without an API key — great for reliable demos.
- Saved sessions persist in browser `localStorage` — no server, no account needed.
- The OpenAI API key is server-side only and never exposed to the browser.
