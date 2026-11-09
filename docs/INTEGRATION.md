# Integration guide

## React

NEON VISION is source code for a Video.js v10 React skin, not a prebuilt component package. In a React application that has `@videojs/react` 10.x installed and can import this repository’s source, compose the official player and media components with the skin:

```tsx
import { VideoPlayer } from '@videojs/react/video';
import { Video } from '@videojs/react/video';
import { VideoSkin } from './src/video/skin';
import './src/skin.css';

export function App() {
  return (
    <VideoPlayer title="Sintel" poster="/sintel-poster.png">
      <VideoSkin>
        <Video src="/sintel.mp4" poster="/sintel-poster.png" playsInline>
          <track kind="subtitles" src="/sintel-en.vtt" srcLang="en" label="English" default />
        </Video>
      </VideoSkin>
    </VideoPlayer>
  );
}
```

Use `MuxVideo` for the included Mux source, or the appropriate documented Video.js v10 media adapter for another playback engine. The `src/video/playlist.ts` types describe entries used by the preview. To embed a configurable playlist in your application, keep the playlist and selected source in your application state, render the active media component inside `VideoPlayer`/`VideoSkin`, and change the source via React props. The project currently has no published package, build export map, or standalone `PlaylistPlayer` export; the preview’s `Player` component is workbench code.

The media component stays inside Video.js React context so its controls use the same media state and actions. Do not render a second native player beside it. Follow the [Video.js React source guide](https://videojs.org/docs/framework/react/guides/media-sources) for engine-specific HLS, DASH, and source typing.

## Plain HTML site

There is no standalone bundle that defines custom HTML player elements. Importing the TypeScript React source into a plain HTML file is not supported as a direct script include.

After a future deployment, the preview can be embedded as an iframe demonstration:

```html
<iframe
  src="https://YOUR-DEPLOYED-WORKBENCH.example/preview.html"
  title="NEON VISION video player preview"
  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
  allowfullscreen
  loading="lazy"
  width="960"
  height="540"
></iframe>
```

Replace the placeholder only after deployment. An iframe hosts the preview application; it is not an independently configurable player SDK. A true distributable would need a package build, declared exports, CSS handling, and documented external media/asset contracts.

## Build outputs

`npm run build` uses Vite to emit both `index.html` (workbench shell) and `preview.html` (player frame) into `dist/`, with relative asset URLs. The workbench shell embeds `preview.html`. Vite’s production build is not currently configured to emit a reusable React library bundle.
