# Release preparation and feasibility

## Current build and hosting

- `npm run build` runs the configured Vite build.
- Build output: `dist/`; both the options shell (`index.html`) and player frame (`preview.html`) are emitted.
- `vite.config.ts` uses `base: '/'`; the current hosting configuration targets the domain root.
- `vercel.json` and `netlify.toml` point to the Vite build and `dist/` output. A Cloudflare Pages script is also present.
- Public subtitle/chapter VTT files are under `apps/preview/public/` and should be copied by Vite into the preview build.
- No deploy command has been run. Host authentication, project creation, and publishing remain future explicit steps.

## Package and clean install

The root package is private and has no package `exports`, library build, published artifact, or standalone player bundle. `npm ci` is the clean dependency installation command. It was not run as part of the implementation pass because it would replace the existing installed dependency tree; validate it in a clean checkout/CI before handoff. The lockfile is checked in.

The local Git repository is on `main` with initial commit `40f6961e63d192ca5d5560e80c284365c5f3a5f9`; no remote is configured. A staged-content scan found no private Mux credential patterns or other matching secret patterns. `.gitignore` excludes dependencies, build output, local environment files, credential/key files, caches, logs, and hosting CLI state. No credentials are needed for local preview or build. Remote GitHub publication and deployment remain deferred.

## Clip-export feasibility

Clip export is not implemented. A browser-only implementation would need to capture a media stream, mux audio/video with `MediaRecorder`, choose a supported container/codec, manage seeking and stream lifetime, and handle CORS/security policy. The generic Video.js `Media` contract does not guarantee `captureStream`; Mux-managed HLS may be an MSE-backed element and may not expose a capture stream consistently, while DRM generally forbids it. Browser recorder MIME support differs. A robust implementation requires source-by-source browser tests and likely server-side processing for reliable exports. Recommended next step: define supported sources/browsers and perform a feasibility spike before adding a user-facing control.

The current preview does not expose source-segment URLs or an authorized media segment extraction API to the skin. Recording an HTML media element with `MediaRecorder` would record playback output, not produce an original-quality or frame-accurate source clip, and cannot be guaranteed to include audio or work with both the Mux HLS adapter and cross-origin Sintel source without browser/CORS testing. The requested Export Clip control is therefore deferred, with no misleading menu item. There is no server-side service and no dependency was added.

## Audio processing feasibility

Voice Boost and Stable Volume remain deferred. A `MediaElementAudioSourceNode` is bound to one media element and cannot be freely recreated for a remounted source. Web Audio output can also be silent or fail when cross-origin media is not CORS-authorized; the existing Mux HLS adapter/source and native Sintel source need separate browser testing. Stable Volume built from a compressor would be dynamic-range compression, not loudness normalization. Do not add controls until persistent graph lifecycle, CORS, source switching, and browser compatibility have been proven without muting playback.

## Frame-range export

Settings keeps the current-frame PNG action. The 10/20/30-frame sequence options were removed because browser seeking could not reliably guarantee unique decoded frames and playback restoration. Current-frame export was verified with both Mux and Sintel in Chrome. Time-range capture and ZIP packaging are not implemented. No package changes were made for this work.

Stage 2.4 adds the Royal Gold accent preset, a nested Accent Theme selector, fixed-height playlist overlays with an internally scrolling item region, a single-row compact mobile action toolbar, and viewport-contained Theater sizing. It also standardizes tooltip offsets and changes Save Frames to current-frame capture only.

## Remaining build notices

Vite may report a large preview JavaScript chunk; the application currently bundles both the workbench and player frame. Do not split Video.js or its player state without checking both entry pages. A React Compiler directive warning, if emitted by the installed plugin version, is non-fatal. Record current command output in CI before a release.
