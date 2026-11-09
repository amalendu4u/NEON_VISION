/**
 * Configuration types for applications that compose NEON VISION with
 * `VideoPlayer` and `VideoSkin`. Keep media sources and their real metadata
 * outside the skin's control components.
 */
export interface PlaylistTrack {
  kind: 'subtitles' | 'captions' | 'chapters' | 'metadata';
  src: string;
  label: string;
  srcLang?: string;
  default?: boolean;
}

export interface PlaylistItem {
  id: string;
  title: string;
  /** URL of a source playable by the selected media component. */
  src: string;
  /** MIME type, e.g. `video/mp4` or `application/x-mpegURL`. */
  type: string;
  /** `mux` uses the existing Mux adapter; `video` uses native Video. */
  adapter: 'mux' | 'video';
  poster: string;
  thumbnail?: string;
  description?: string;
  tracks?: readonly PlaylistTrack[];
  /** The media source itself exposes genuine chapter metadata. */
  hasChapters?: boolean;
  /** Optional Video.js-compatible storyboard metadata track. */
  thumbnailTrack?: PlaylistTrack;
  duration?: string;
  aspectRatio?: `${number}:${number}`;
}

/** Product demo playlist: the public playback IDs supplied for NEON VISION. */
export const PRODUCT_PLAYLIST: readonly PlaylistItem[] = [
  {
    id: 'elephants-dream', title: 'Elephants Dream', description: 'A surreal journey through a machine world.',
    src: 'https://stream.mux.com/aFqzRzKGE4uErMnT7Od8TeNwZ6ICIlvOL5qM01b1CHnE.m3u8',
    type: 'application/x-mpegURL', adapter: 'mux', aspectRatio: '16:9', duration: '10:53',
    hasChapters: true,
    poster: 'https://image.mux.com/aFqzRzKGE4uErMnT7Od8TeNwZ6ICIlvOL5qM01b1CHnE/thumbnail.webp?time=30',
  },
  {
    id: 'tears-of-steel', title: 'Tears of Steel', description: 'A live-action and animated sci-fi short.',
    src: 'https://stream.mux.com/hWAqpFA2BFD0021okL3cJPPkUk5JtJfh3mb01elQchCAE.m3u8',
    type: 'application/x-mpegURL', adapter: 'mux', aspectRatio: '431:180', duration: '12:14',
    hasChapters: true,
    poster: 'https://image.mux.com/hWAqpFA2BFD0021okL3cJPPkUk5JtJfh3mb01elQchCAE/thumbnail.webp?time=30',
  },
  {
    id: 'big-buck-bunny', title: 'Big Buck Bunny', description: 'A playful animated short in a lush forest.',
    src: 'https://stream.mux.com/LLUXXpc5CxWjqDQFZx5ARayyiomCKSz1PIk9oyUSlRA.m3u8',
    type: 'application/x-mpegURL', adapter: 'mux', aspectRatio: '16:9', duration: '09:56',
    poster: 'https://image.mux.com/LLUXXpc5CxWjqDQFZx5ARayyiomCKSz1PIk9oyUSlRA/thumbnail.webp?time=30',
  },
];

// These are the two verified preview sources. Keep the Mux trailer first so it
// remains the initial media and preserves the original default asset.
export const DEFAULT_PLAYLIST: readonly PlaylistItem[] = [
  {
    id: 'cosmic-dawn',
    title: 'NASA Cosmic Dawn Trailer',
    description: 'NASA trailer preview served through the existing Mux adapter.',
    src: 'https://stream.mux.com/83EzHOvVzVN01AsrD01BCpiH02Pj3S8mfzBOu101w2nHC5s.m3u8',
    type: 'application/x-mpegURL',
    adapter: 'mux',
    poster: 'https://image.mux.com/83EzHOvVzVN01AsrD01BCpiH02Pj3S8mfzBOu101w2nHC5s/thumbnail.webp?time=69',
    duration: '01:51',
    hasChapters: true,
  },
  {
    id: 'sintel',
    title: 'Sintel — The Open Movie',
    description: 'Sintel short preview with English subtitles.',
    src: 'https://mdn.github.io/shared-assets/videos/sintel-short.mp4',
    type: 'video/mp4',
    adapter: 'video',
    poster: 'https://media.w3.org/2010/05/sintel/poster.png',
    tracks: [{ kind: 'subtitles', label: 'English', srcLang: 'en', src: './sintel-en.vtt', default: true }],
  },
];
