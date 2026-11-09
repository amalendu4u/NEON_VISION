# Playlist configuration

The preview’s UP NEXT list is configured with `PlaylistItem` entries in [`src/video/playlist.ts`](../src/video/playlist.ts). `Player` accepts an optional `playlist` prop. The NASA Cosmic Dawn Mux item is first and remains the default; Sintel remains the real MP4 subtitle example. On desktop, UP NEXT is a fixed-height glass overlay aligned inside the player shell; the heading stays visible while the item list scrolls. It does not resize the video. On tablet and mobile it opens below the player and controls. The layout responds to the available preview width.

The player header also has Theater Mode and Autoplay Next. Theater Mode centers the player within viewport-contained space and preserves its aspect ratio; the UP NEXT panel is hidden while Theater Mode is active and returns to its prior open state on exit. Theater Mode is independent of browser fullscreen. Autoplay Next persists its preference and advances to the next configured item after an ended event; it does not autoplay on initial load. Browser autoplay policy can reject the requested playback, in which case the preview reports that the viewer can press Play. The final item does not wrap to the beginning.

## Add, remove, reorder, or edit a video

Edit `DEFAULT_PLAYLIST` (or pass your own array to `Player`). Add an entry to add a video, remove it to remove a video, change its array position to reorder, and edit its `title`, `src`, `type`, `poster`, `description`, and tracks to update it. IDs must be unique. The currently selected item is kept while it remains in the array; when removed, selection falls back to the first entry.

```tsx
import { Player } from './apps/preview/src/frame/player';
import type { PlaylistItem } from './src/video/playlist';

const playlist: PlaylistItem[] = [
  {
    id: 'mux-default',
    title: 'Cosmic Dawn',
    src: 'https://stream.mux.com/83EzHOvVzVN01AsrD01BCpiH02Pj3S8mfzBOu101w2nHC5s.m3u8',
    type: 'application/x-mpegURL',
    adapter: 'mux',
    poster: 'https://image.mux.com/83EzHOvVzVN01AsrD01BCpiH02Pj3S8mfzBOu101w2nHC5s/thumbnail.webp?time=69',
    tracks: [{ kind: 'chapters', label: 'English', srcLang: 'en', src: '/chapters.vtt', default: true }],
  },
  {
    id: 'movie-mp4',
    title: 'Sintel',
    src: 'https://mdn.github.io/shared-assets/videos/sintel-short.mp4',
    type: 'video/mp4',
    adapter: 'video',
    poster: 'https://media.w3.org/2010/05/sintel/poster.png',
    tracks: [{ kind: 'subtitles', label: 'English', srcLang: 'en', src: '/sintel-en.vtt', default: true }],
  },
];

<Player playlist={playlist} />
```

This example documents the preview component’s current source path; the repository does not currently publish a package export for `Player`. For an application outside this repository, compose `VideoPlayer` and `VideoSkin` directly as described in [integration](INTEGRATION.md), and wire its own playlist state to the active media component.

## Fields

- `id`, `title`, `src`, `type`, `adapter`, `poster` are required.
- `adapter: 'mux'` uses the existing Mux media adapter. The project verifies the Mux-hosted HLS URL above.
- `adapter: 'video'` renders a native Video.js React `Video` element with a typed `<source>`. MP4 is widely supported; native HLS depends on the browser and its codecs.
- `description` is optional playlist metadata.
- `tracks` supports `subtitles`, `captions`, `chapters`, and `metadata` WebVTT tracks.
- Set `hasChapters: true` when the media source exposes genuine in-band chapters (as the default Mux stream does); use a `kind: 'chapters'` entry in `tracks` for a separate WebVTT chapter file.
- A chapter track is associated with only the playlist item that declares it. Chapter cues name sections and seek to their start; subtitle/caption cues display spoken or descriptive text over time. Keep chapter cues chronological, non-overlapping, and within the exact media version’s duration.
- `thumbnail` is optional playlist artwork metadata; `thumbnailTrack` can supply a storyboard track understood by the Video.js timeline. The preview only displays posters today.
- `duration` is optional display text. If omitted, no duration badge is shown; don’t invent a duration.

## CORS, playback, and source handling

Source selection remounts the selected media component through React and calls the current Video.js media API to reset time and request playback. A browser may reject that play request; the viewer can press Play. Cross-origin captions, posters, and media need suitable server CORS headers. `crossOrigin="anonymous"` on native video requires the media host to allow the page origin. Browser codec support and HLS support vary. An HLS URL configured with the native adapter may fail where the browser lacks native HLS; the error dialog remains active. A generic HLS.js adapter is not installed.

## Thumbnails and chapters

Use actual WebVTT chapter cues (`kind="chapters"`) for chapter titles/markers. For timeline thumbnails, provide a genuine Video.js-compatible storyboard metadata track with image URLs and optional sprite coordinates, as `thumbnailTrack`. The track must be served with CORS permission when cross-origin. The bundled Mux adapter provides its supported Mux storyboard metadata automatically; the Sintel demo has no supplied storyboard, so its timeline falls back to the time/chapter preview.
