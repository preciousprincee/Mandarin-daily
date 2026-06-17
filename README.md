# 每日普通话 · Mandarin Daily

An AI-powered Mandarin learning app with daily lessons, streak tracking, gamification, and PWA support.

## Features

- 🤖 **AI-Generated Lessons** via Groq API (llama3-70b) — fresh every day
- 📈 **Progressive Curriculum** — Foundations → Fluency over 90+ days
- 🔥 **Streak Counter** — tracks consecutive completed days
- ⚡ **XP & Levels** — earn XP, unlock level titles in Chinese
- 🏅 **Badges** — 10 achievements to earn
- 🗣️ **Text-to-Speech** — hear every word and phrase
- 🎤 **Speaking Practice** — record yourself, get AI feedback
- 🌙 **Dark/Light Mode** — toggle in header or settings
- 📲 **PWA** — installable on iOS/Android, works offline (past lessons)
- 💾 **localStorage** — all data stored in your browser

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

## Getting Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Create an API key
4. Paste it in the app's Settings panel

Your API key is stored only in your browser's localStorage — it never leaves your device except when calling Groq's API directly.

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** (dark mode, custom tokens)
- **vite-plugin-pwa** (service worker, manifest)
- **Groq API** (llama3-70b-8192)
- **Web Speech API** (TTS + STT, browser native)
- **localStorage** (all persistence)

## PWA Icons

For production, replace the placeholder icons in `/public/` with real PNG files:
- `pwa-192x192.png` (192×192)
- `pwa-512x512.png` (512×512)
- `apple-touch-icon.png` (180×180)

You can generate these from the `favicon.svg` using a tool like [Real Favicon Generator](https://realfavicongenerator.net).

## Project Structure

```
src/
  components/
    Header.jsx         # Sticky nav with streak pill
    HomeView.jsx       # Daily lesson page
    LessonCard.jsx     # Tabbed lesson UI (word/phrase/grammar/tone/practice)
    ProgressView.jsx   # Stats, heatmap, curriculum path
    BadgesView.jsx     # Badge collection
    SettingsModal.jsx  # API key + dark mode + reset
    XPBar.jsx          # Level/XP progress bar
    BadgeToast.jsx     # Badge earned notification
    XPToast.jsx        # XP earned notification
  hooks/
    useAppState.js     # Central state + localStorage sync
    useSpeech.js       # TTS + STT wrapper
  utils/
    storage.js         # localStorage helpers
    gamification.js    # XP, levels, badges, curriculum
    groq.js            # Groq API calls
```
