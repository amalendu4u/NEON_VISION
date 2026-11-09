# NEON VISION

NEON VISION is a premium dark Video.js 10 skin for React. It keeps the official `@videojs/react` player, media context, stateful controls, and Mux adapter, with a restrained multicolour neon frame and glass control surfaces.

## Stack and features

- Video.js v10 React components (`@videojs/react` and `@videojs/core` 10.3.0)
- React 19 and TypeScript
- Premium dark skin, animated neon perimeter, settings, captions, quality, audio tracks, playback rate, PiP, casting, AirPlay, fullscreen, timeline chapters, and media feedback
- Configurable Mux and native media playlist sample, with NASA Cosmic Dawn as the initial source and Sintel as the subtitle demonstration
- Neon Spectrum, Electric Blue, Cyber Lime, and Royal Gold accent presets, persisted in local storage
- PNG capture attempt for the current decoded video frame, with errors reported when the browser or source blocks it
- Product site with `/`, `/player`, `/docs`, and the original workbench at `/workbench`
- Product demo playlist with Elephants Dream, Tears of Steel, and Big Buck Bunny through the existing Mux adapter
- Typed feature configuration in [`src/video/config.ts`](src/video/config.ts)

The playlist types and entries are in [`src/video/playlist.ts`](src/video/playlist.ts). The workbench keeps its NASA Cosmic Dawn and Sintel defaults; the product site uses `PRODUCT_PLAYLIST` with the three supplied Mux playback IDs.

## Requirements and local use

Use Node.js and npm compatible with the installed Vite/TypeScript toolchain. From the project root:

```sh
npm ci
npm run dev
```

Vite prints the local site URL. Use `/workbench` for the skin workbench. `npm run typecheck` checks TypeScript and `npm run build` creates the production site and workbench under `dist/`. `npm run preview` serves that build locally.

## Project structure

- `src/video/` — Video.js React skin, shared controls, behaviors, and playlist configuration types/defaults
- `src/styles/` — skin tokens, neon styling, captions, accessibility preference styles
- `apps/preview/src/frame/` — workbench player and frame page styles
- `apps/preview/public/` — real WebVTT subtitle and chapter tracks
- `design/spec.md` — visual direction and existing design decisions
- `docs/` — feature, integration, accessibility and release notes

Vite serves the product site from `apps/preview/index.html`; the original workbench shell is `apps/preview/workbench.html`, and its player frame remains `apps/preview/preview.html`. Vercel rewrites preserve direct navigation to `/player`, `/docs/*` and `/workbench`.

## Product routes and feature configuration

- `/` — Product overview and live player preview.
- `/player` — Interactive demo using the three Mux streams.
- `/docs` and `/docs/<topic>` — Developer guides for 14 topics.
- `/workbench` — Original Video.js skin workbench.

`Player` accepts an optional typed `config` prop. Optional features default to enabled; core playback controls remain enabled:

```tsx
import type { NeonVisionConfigInput } from '@/video/config';

const neonVisionConfig: NeonVisionConfigInput = {
  theme: 'spectrum',
  features: {
    sleepTimer: true,
    autoplayNext: true,
    theaterMode: false,
    screenshotExport: true,
    playlist: false,
    chapters: false,
  },
};

<Player playlist={PRODUCT_PLAYLIST} config={neonVisionConfig} />
```

## Documentation

- [Feature status](docs/FEATURES.md)
- [Playlist configuration](docs/PLAYLIST-GUIDE.md)
- [React integration and HTML embedding](docs/INTEGRATION.md)
- [Captions, chapters, and thumbnail tracks](docs/CAPTIONS.md)
- [Accessibility and keyboard shortcuts](docs/ACCESSIBILITY.md)
- [Themes](docs/THEMES.md)
- [Screenshot export limitations](docs/SCREENSHOT-EXPORT.md)
- [Release readiness and clip-export feasibility](docs/RELEASE.md)

## Deployment

Deployment is intentionally manual and has not been run. After review and host authentication, use `npm run deploy vercel`, `npm run deploy netlify`, or `npm run deploy cloudflare`. See [`docs/RELEASE.md`](docs/RELEASE.md) for what the current build produces and what it does not package.
