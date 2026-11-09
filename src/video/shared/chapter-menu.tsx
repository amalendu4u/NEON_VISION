/** @jsxImportSource react */

import { isMediaSeekCapable, isMediaTextTrackCapable, Menu, useContainer, useMedia } from '@videojs/react';
import { useEffect, useState } from 'react';

import { ButtonTooltip } from './tooltip';

interface ChapterEntry {
  startTime: number;
  endTime: number;
  title: string;
}

function formatTimestamp(seconds: number) {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainder = wholeSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
    : `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export function ChapterMenu({ available, showUnavailable = false }: { available: boolean; showUnavailable?: boolean }) {
  const media = useMedia();
  const container = useContainer();
  const [chapters, setChapters] = useState<ChapterEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!available || !isMediaTextTrackCapable(media)) {
      setChapters([]);
      return;
    }

    const tracks = media.textTracks;
    const video = media instanceof HTMLVideoElement ? media : container?.querySelector('video') ?? null;
    const trackElements = Array.from(container?.querySelectorAll<HTMLTrackElement>('track[kind="chapters"]') ?? []);
    for (const element of trackElements) {
      if (element.track.mode === 'disabled') element.track.mode = 'hidden';
    }

    const refresh = () => {
      const entries = Array.from(tracks)
        .filter((track) => track.kind === 'chapters')
        .flatMap((track) => Array.from(track.cues ?? []).map((cue) => ({
          startTime: cue.startTime,
          endTime: cue.endTime,
          title: (cue.text ?? '').replace(/<[^>]*>/g, '').trim(),
        })))
        .filter((chapter) => chapter.title.length > 0)
        .sort((a, b) => a.startTime - b.startTime);
      // Some streaming sources expose the same chapters both as a text track
      // and as in-band metadata. Keep one entry per timestamp and title.
      const uniqueEntries = new Map<string, ChapterEntry>();
      for (const chapter of entries) {
        const key = `${chapter.startTime}:${chapter.title}`;
        if (!uniqueEntries.has(key)) uniqueEntries.set(key, chapter);
      }
      setChapters([...uniqueEntries.values()]);
    };
    const updateTime = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    const handleTrackLoad = () => refresh();

    refresh();
    updateTime();
    tracks.addEventListener('addtrack', refresh);
    tracks.addEventListener('removetrack', refresh);
    tracks.addEventListener('change', refresh);
    for (const element of trackElements) element.addEventListener('load', handleTrackLoad);
    video?.addEventListener('timeupdate', updateTime);
    video?.addEventListener('seeking', updateTime);
    video?.addEventListener('seeked', updateTime);
    const poll = video ? undefined : window.setInterval(() => {
      if (isMediaSeekCapable(media)) setCurrentTime(media.currentTime);
    }, 1000);

    return () => {
      tracks.removeEventListener('addtrack', refresh);
      tracks.removeEventListener('removetrack', refresh);
      tracks.removeEventListener('change', refresh);
      for (const element of trackElements) element.removeEventListener('load', handleTrackLoad);
      video?.removeEventListener('timeupdate', updateTime);
      video?.removeEventListener('seeking', updateTime);
      video?.removeEventListener('seeked', updateTime);
      if (poll !== undefined) window.clearInterval(poll);
    };
  }, [available, container, media]);

  if (!available && !showUnavailable) return null;
  const activeIndex = chapters.findIndex((chapter) => currentTime >= chapter.startTime && currentTime < chapter.endTime);

  return (
    <Menu.Root side="bottom" align="end">
      <ButtonTooltip label="Chapters" side="bottom">
        <Menu.Trigger className="media-button neon-chapters-toggle" aria-label="Open chapters">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 5h14M5 12h14M5 19h14" />
            <path d="M2.5 5h.01M2.5 12h.01M2.5 19h.01" strokeWidth="3" />
          </svg>
        </Menu.Trigger>
      </ButtonTooltip>
      <Menu.Popup keepMounted className="media-popup media-popup-safe-area media-menu-popup neon-chapters-panel">
        <Menu.Content className="media-menu-content neon-chapters-content">
          <div className="media-settings-heading"><span>CHAPTERS</span></div>
          <Menu.Separator className="media-menu-separator" />
          <div className="neon-chapter-items" role="group" aria-label="Chapter list">
            {chapters.length === 0 ? <p className="neon-chapters-empty" role="status">{available ? 'Chapter cues are not currently exposed by this source.' : 'No chapters are available for this video.'}</p> : chapters.map((chapter, index) => (
              <Menu.Item
                className="media-menu-item neon-chapter-item"
                key={`${chapter.startTime}:${chapter.title}`}
                aria-current={index === activeIndex ? 'time' : undefined}
                onClick={() => {
                  if (isMediaSeekCapable(media)) media.currentTime = chapter.startTime;
                }}
              >
                <time className="neon-chapter-time">{formatTimestamp(chapter.startTime)}</time>
                <span className="neon-chapter-title">{chapter.title}</span>
              </Menu.Item>
            ))}
          </div>
        </Menu.Content>
      </Menu.Popup>
    </Menu.Root>
  );
}
