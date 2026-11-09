import { MuxVideo } from '@videojs/react/media/mux-video';
import { isMediaSeekCapable, isMediaSourceCapable, useHotkey, useMedia } from '@videojs/react';
import { Video, VideoPlayer } from '@videojs/react/video';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

import { VideoSkin } from '@/video/skin';
import { DEFAULT_PLAYLIST, type PlaylistItem } from '@/video/playlist';
import { ButtonTooltip } from '@/video/shared/tooltip';
import { ChapterMenu } from '@/video/shared/chapter-menu';
import { resolveNeonVisionConfig, type NeonVisionConfigInput } from '@/video/config';

export interface PlayerPlaybackOptions {
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

export interface PlayerProps {
  media?: PlayerPlaybackOptions;
  /** Override the demo videos with an ordered playlist configuration. */
  playlist?: readonly PlaylistItem[];
  /** Whether the preview has room for a separate desktop playlist column. */
  sidePlaylistAvailable?: boolean;
  config?: NeonVisionConfigInput;
}

function PlaylistTrackElements({ item }: { item: PlaylistItem }) {
  return <>
    {item.tracks?.map((track) => <track key={`${track.kind}:${track.src}`} {...track} />)}
    {item.thumbnailTrack && <track key={`thumbnail:${item.thumbnailTrack.src}`} {...item.thumbnailTrack} />}
  </>;
}

function PlaylistPanel({ items, open, selectedId, theater, onClose, onSelect }: {
  items: readonly PlaylistItem[];
  open: boolean;
  selectedId: string;
  theater: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) window.requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  return (
    <aside
      id="neon-vision-playlist"
      className="neon-playlist"
      data-open={open}
      data-theater-hidden={theater}
      aria-label="Up next playlist"
      aria-hidden={!open || theater}
      inert={!open || theater}
    >
      <div className="neon-playlist-header">
        <div className="neon-playlist-heading">
          <h2><span aria-hidden="true" />UP NEXT</h2>
          <button className="neon-playlist-close" ref={closeRef} type="button" onClick={onClose} aria-label="Close playlist">×</button>
        </div>
        <p className="neon-playlist-count">{items.length} VIDEOS</p>
      </div>
      <div className="neon-playlist-items" role="group" aria-label="Playlist videos">
        {items.map((item) => (
          <button
            className="neon-playlist-item"
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-pressed={selectedId === item.id}
          >
            <span className="neon-playlist-thumb">
              <img src={item.poster} alt="" />
              {item.duration && <span>{item.duration}</span>}
            </span>
            <span className="neon-playlist-copy">
              <strong>{item.title}</strong>
              <span>{selectedId === item.id ? 'NOW PLAYING' : item.description ?? item.type}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="neon-playlist-note">Select a title to load and play it.</p>
    </aside>
  );
}

function SourcePlayback({ selectedId, selectedSrc, selectedAdapter, pendingPlayId, onPlayHandled, onPlayBlocked }: {
  selectedId: string;
  selectedSrc: string;
  selectedAdapter: PlaylistItem['adapter'];
  pendingPlayId: string | null;
  onPlayHandled: () => void;
  onPlayBlocked: () => void;
}) {
  const media = useMedia();

  useEffect(() => {
    if (!media || pendingPlayId !== selectedId || !isMediaSourceCapable(media)) return;

    // The old adapter can still be attached for a commit after selection changes. Wait for the new source
    // to register before resetting time or requesting playback.
    const expectedSource = new URL(selectedSrc, window.location.href);
    const attachedSource = new URL(media.currentSrc || media.src, window.location.href);
    const isMuxAdapterSource = selectedAdapter === 'mux' && attachedSource.protocol === 'blob:';
    const isExpectedSource =
      attachedSource.origin === expectedSource.origin && attachedSource.pathname === expectedSource.pathname;
    if (!isMuxAdapterSource && !isExpectedSource) return;

    if (isMediaSeekCapable(media)) media.currentTime = 0;
    void media.play().catch(onPlayBlocked).finally(onPlayHandled);
  }, [media, onPlayBlocked, onPlayHandled, pendingPlayId, selectedId, selectedAdapter, selectedSrc]);

  return null;
}

function TheaterModeHotkey({ onToggle }: { onToggle: () => void }) {
  useHotkey({ keys: 't', action: 'toggleTheaterMode', onActivate: onToggle });
  return null;
}

function readViewportSize() {
  return {
    width: Math.round(window.visualViewport?.width ?? window.innerWidth),
    height: Math.round(window.visualViewport?.height ?? window.innerHeight),
  };
}

/** `media` carries the workbench's playback options: autoplay, muted, loop, and preload. */
export function Player({ media, playlist = DEFAULT_PLAYLIST, sidePlaylistAvailable = false, config: configInput }: PlayerProps) {
  const config = resolveNeonVisionConfig(configInput);
  const { features } = config;
  const items = playlist.length ? playlist : DEFAULT_PLAYLIST;
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const firstId = items[0]!.id;
  const [selectedId, setSelectedId] = useState(firstId);
  const [pendingPlayId, setPendingPlayId] = useState<string | null>(null);
  const [theater, setTheater] = useState(false);
  const [viewportSize, setViewportSize] = useState(readViewportSize);
  const [autoplayNext, setAutoplayNext] = useState(() => {
    if (!features.autoplayNext || !features.playlist || items.length < 2) return false;
    try { return localStorage.getItem('neon-vision-autoplay-next') === 'true'; } catch { return false; }
  });
  const [playbackMessage, setPlaybackMessage] = useState('');
  const playlistToggleRef = useRef<HTMLButtonElement>(null);
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0]!;
  const selectedIndex = items.findIndex((item) => item.id === selectedItem.id);
  const canAutoplayNext = features.autoplayNext && features.playlist && selectedIndex >= 0 && selectedIndex < items.length - 1;
  const aspectParts = (selectedItem.aspectRatio ?? '16:9').split(':').map(Number);
  const aspectWidth = Number.isFinite(aspectParts[0]) && aspectParts[0]! > 0 ? aspectParts[0]! : 16;
  const aspectHeight = Number.isFinite(aspectParts[1]) && aspectParts[1]! > 0 ? aspectParts[1]! : 9;
  const playerAspectRatio = aspectWidth / aspectHeight;
  const theaterWidth = Math.max(0, Math.min(viewportSize.width - 24, (viewportSize.height - 168) * playerAspectRatio));
  const streamLayoutStyle = {
    '--neon-theater-width': `${theaterWidth}px`,
  } as CSSProperties;
  const handlePlayHandled = useCallback(() => setPendingPlayId(null), []);
  const handlePlayBlocked = useCallback(() => setPlaybackMessage('Playback was blocked. Press Play to continue.'), []);

  useEffect(() => {
    if (!items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0]!.id);
    }
  }, [items, selectedId]);

  useLayoutEffect(() => {
    if (!theater) return;
    const updateViewport = () => setViewportSize(readViewportSize());
    window.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('resize', updateViewport);
    updateViewport();
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('resize', updateViewport);
    };
  }, [theater]);

  useEffect(() => {
    if (!canAutoplayNext) {
      setAutoplayNext(false);
      try { localStorage.removeItem('neon-vision-autoplay-next'); } catch { /* Storage may be disabled. */ }
      return;
    }
    try { localStorage.setItem('neon-vision-autoplay-next', String(autoplayNext)); } catch { /* Storage may be disabled. */ }
  }, [autoplayNext, canAutoplayNext]);

  const closePlaylist = useCallback(() => {
    setPlaylistOpen(false);
    window.requestAnimationFrame(() => playlistToggleRef.current?.focus({ preventScroll: true }));
  }, []);

  const selectItem = useCallback((id: string) => {
    if (id === selectedId) {
      closePlaylist();
      return;
    }
    setPlaybackMessage('');
    setSelectedId(id);
    setPendingPlayId(id);
    closePlaylist();
  }, [closePlaylist, selectedId]);

  const onMediaEnded = useCallback(() => {
    if (!canAutoplayNext || !autoplayNext) return;
    const currentIndex = items.findIndex((item) => item.id === selectedId);
    const nextItem = items[currentIndex + 1];
    if (!nextItem) {
      setPlaybackMessage('Autoplay is on. The playlist has ended.');
      return;
    }
    setPlaybackMessage('');
    setSelectedId(nextItem.id);
    setPendingPlayId(nextItem.id);
  }, [autoplayNext, canAutoplayNext, items, selectedId]);

  return (
    <>
      {theater && <div className="neon-theater-placeholder" style={{ aspectRatio: `${aspectWidth} / ${aspectHeight}` }} aria-hidden="true" />}
      <div className="neon-stream-layout" style={streamLayoutStyle} data-playlist-open={features.playlist && playlistOpen} data-theater={features.theaterMode && theater} data-autoplay-next={canAutoplayNext && autoplayNext} data-sidebar-layout={sidePlaylistAvailable ? 'side' : 'stack'}>
      <VideoPlayer poster={selectedItem.poster} title={selectedItem.title}>
        <div className="neon-player-main" style={{ aspectRatio: selectedItem.aspectRatio?.replace(':', ' / ') }}>
          <VideoSkin
            features={features}
            initialTheme={config.theme}
            playlistToggle={features.playlist && <>
              <ButtonTooltip label="Playlist" side="bottom">
                <button
                  className="media-button neon-playlist-toggle"
                  ref={playlistToggleRef}
                  type="button"
                  aria-label="Playlist"
                  aria-controls="neon-vision-playlist"
                  aria-expanded={playlistOpen && !theater}
                  onClick={() => setPlaylistOpen((open) => !open)}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M8 8h8M8 12h8M8 16h5" />
                  </svg>
                </button>
              </ButtonTooltip>
            </>}
            topActions={
              <>
                {canAutoplayNext && <ButtonTooltip label={`Autoplay ${autoplayNext ? 'On' : 'Off'}`} side="bottom">
                  <button
                    className="media-button neon-autoplay-toggle"
                    type="button"
                    aria-pressed={autoplayNext}
                    aria-label={`Autoplay ${autoplayNext ? 'On' : 'Off'}`}
                    onClick={() => { setPlaybackMessage(''); setAutoplayNext((enabled) => !enabled); }}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7v5h-5M4 17v-5h5M5.5 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.5-3" />
                      <path d="m10 9 5 3-5 3z" />
                    </svg>
                  </button>
                </ButtonTooltip>}
                {features.chapters && <ChapterMenu
                  key={selectedItem.id}
                  available={Boolean(selectedItem.hasChapters || selectedItem.tracks?.some((track) => track.kind === 'chapters'))}
                />}
              </>
            }
            toolbarActions={
              <>
                {features.theaterMode && <>
                <ButtonTooltip label="Theater Mode" shortcutLabel="T">
                  <button
                    className="media-button neon-theater-toggle"
                    type="button"
                    aria-pressed={theater}
                    aria-label={`Theater mode ${theater ? 'on' : 'off'}`}
                    onClick={() => setTheater((enabled) => !enabled)}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 9h18" />
                    </svg>
                  </button>
                </ButtonTooltip>
                </>}
              </>
            }
          >
            {selectedItem.adapter === 'mux' ? (
              <MuxVideo key={selectedItem.id} {...media} src={selectedItem.src} playsInline crossOrigin="" onEnded={canAutoplayNext ? onMediaEnded : undefined}>
                <PlaylistTrackElements item={selectedItem} />
              </MuxVideo>
            ) : (
              <Video key={selectedItem.id} {...media} poster={selectedItem.poster} playsInline crossOrigin="anonymous" onEnded={canAutoplayNext ? onMediaEnded : undefined}>
                <source src={selectedItem.src} type={selectedItem.type} />
                <PlaylistTrackElements item={selectedItem} />
              </Video>
            )}
          </VideoSkin>
        </div>
        {features.theaterMode && <TheaterModeHotkey onToggle={() => setTheater((enabled) => !enabled)} />}
        <SourcePlayback
          selectedId={selectedId}
          selectedSrc={selectedItem.src}
          selectedAdapter={selectedItem.adapter}
          pendingPlayId={pendingPlayId}
          onPlayHandled={handlePlayHandled}
          onPlayBlocked={handlePlayBlocked}
        />
        <span className="neon-playback-message" role="status" aria-live="polite">{playbackMessage}</span>
      </VideoPlayer>
      {features.playlist && <PlaylistPanel
        items={items}
        open={playlistOpen}
        selectedId={selectedId}
        theater={theater}
        onClose={closePlaylist}
        onSelect={selectItem}
      />}
      <span className="neon-playback-message" role="status" aria-live="polite">{playbackMessage}</span>
      </div>
    </>
  );
}
