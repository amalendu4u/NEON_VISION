# Captions, chapters, and timeline previews

Video.js v10 reads text tracks from `<track>` children on the media component. Keep track files reachable at the final deployment path and return a `text/vtt` content type with CORS permission when served from another origin.

The preview includes an English Sintel subtitle track (`apps/preview/public/sintel-en.vtt`) and real chapter metadata exposed by the NASA Cosmic Dawn Mux stream. The captions button and Settings → Captions use the Video.js React text-track components. The seekbar uses `TimeSlider.Chapters`, `ChapterTitle`, and the native timeline. The in-player Chapters toolbar menu reads the active media's real chapter text-track cues, highlights the cue covering the playhead, and seeks to a selected cue's start. The chapter button is hidden when the selected playlist entry has no chapter metadata; Sintel currently has no chapter metadata, so no Sintel entries are invented.

Example configuration:

```ts
tracks: [
  { kind: 'subtitles', label: 'English', srcLang: 'en', src: '/captions/en.vtt', default: true },
  { kind: 'chapters', label: 'Chapters', srcLang: 'en', src: '/chapters.vtt' },
]
```

For image previews while seeking, set `thumbnailTrack` to a genuine storyboard metadata WebVTT track whose cues identify images or sprite regions. Mux media supplies its supported storyboard track through the Mux adapter. There are no Sintel thumbnail frames in this project, so thumbnail preview for Sintel is not claimed. See the official [Video.js timeline thumbnail guide](https://videojs.org/docs/framework/react/guides/thumbnails).

If captions do not appear, check that the VTT starts with `WEBVTT`, has valid cue timestamps, the URL resolves without a 404, the response is CORS-enabled, and the captions menu has the intended track selected. Browser caption rendering and user caption preferences can differ.
