/** @jsxImportSource react */

'use client';

import '../styles/video/scaffold.css';
import './skin.css';
import '../styles/video/neon-vision.css';
import { Container as ContainerPrimitive, Poster as PosterPrimitive, Slider as SliderPrimitive } from '@videojs/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useContainer, useMedia } from '@videojs/react';

import { cn } from '@/lib/resolve-class-name';

import { VideoGestures } from './behaviors/gestures';
import { VideoHotkeys } from './behaviors/hotkeys';
import { VideoControls } from './controls';
import { ErrorDialog } from './shared/error-dialog';
import { Indicators } from './shared/indicators';
import { SeekIndicator } from './shared/seek-indicator';
import { StatusAnnouncer } from './shared/status-announcer';
import { Poster } from './shared/video-feedback';
import { NeonThemeContext, type NeonTheme } from './shared/theme-context';
import type { NeonVisionFeatures } from './config';

function MobilePlaybackVisibility() {
  const media = useMedia();
  const container = useContainer();
  const focusedOverlayControlRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const video = media instanceof HTMLVideoElement ? media : container?.querySelector('video');
    if (!container || !video) return;
    const focusSelector = '.media-captions-button, .neon-autoplay-toggle, .neon-playlist-toggle';
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !container.contains(target)) return;
      const control = target?.closest(focusSelector);
      focusedOverlayControlRef.current = control ? control as HTMLElement : null;
    };
    document.addEventListener('focusin', onFocusIn, true);

    const setPlaying = (playing: boolean) => {
      const activeElement = document.activeElement;
      const activeOverlayControl = activeElement instanceof Element ? activeElement.closest(focusSelector) : null;
      const shouldRestoreFocus = playing && container.clientWidth < 544 &&
        ((activeOverlayControl !== null && container.contains(activeOverlayControl)) ||
          (focusedOverlayControlRef.current !== null && container.contains(focusedOverlayControlRef.current)));

      container.toggleAttribute('data-neon-playing', playing);
      if (!shouldRestoreFocus) return;

      const playButton = container.querySelector<HTMLElement>('.video-controls-bottom .media-play-button');
      playButton?.focus({ preventScroll: true });
    };
    const onPlaying = () => setPlaying(true);
    const onNotPlaying = () => setPlaying(false);

    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onNotPlaying);
    video.addEventListener('ended', onNotPlaying);
    video.addEventListener('emptied', onNotPlaying);
    video.addEventListener('loadstart', onNotPlaying);
    setPlaying(!video.paused && !video.ended);

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onNotPlaying);
      video.removeEventListener('ended', onNotPlaying);
      video.removeEventListener('emptied', onNotPlaying);
      video.removeEventListener('loadstart', onNotPlaying);
      document.removeEventListener('focusin', onFocusIn, true);
      container.removeAttribute('data-neon-playing');
    };
  }, [container, media]);

  return null;
}

function getInitialTheme(): NeonTheme {
  try {
    const stored = window.localStorage.getItem('neon-vision-theme');
    return stored === 'blue' || stored === 'lime' || stored === 'gold' ? stored : 'spectrum';
  } catch {
    return 'spectrum';
  }
}

export interface VideoSkinProps extends Omit<ContainerPrimitive.Props, 'children'> {
  children?: ReactNode;
  playlistToggle?: ReactNode;
  topActions?: ReactNode;
  toolbarActions?: ReactNode;
  renderPoster?: PosterPrimitive.ImageProps['render'];
  renderThumbnail?: SliderPrimitive.Thumbnail.ImageProps['render'];
  features?: NeonVisionFeatures;
  initialTheme?: NeonTheme;
}

export function VideoSkin({ children, className, playlistToggle, topActions, toolbarActions, renderPoster, renderThumbnail, features, initialTheme, ...props }: VideoSkinProps = {}) {
  const [theme, setTheme] = useState<NeonTheme>(() => {
    const persisted = getInitialTheme();
    try { return window.localStorage.getItem('neon-vision-theme') ? persisted : initialTheme ?? persisted; }
    catch { return initialTheme ?? persisted; }
  });
  useEffect(() => {
    try { window.localStorage.setItem('neon-vision-theme', theme); } catch { /* Storage can be disabled by browser policy. */ }
  }, [theme]);

  return (
    <NeonThemeContext.Provider value={{ theme, setTheme }}>
      <ContainerPrimitive
        className={cn('media-skin', 'media-container', 'media-video', className)}
        data-theme="scaffold"
        data-preset="video"
        data-neon-theme={theme}
        {...props}
      >
        <div className="neon-video-viewport">
          {children}
          <Poster renderImage={renderPoster} />
        </div>
        <ErrorDialog />
        <VideoControls renderThumbnail={renderThumbnail} playlistToggle={playlistToggle} topActions={topActions} toolbarActions={toolbarActions} features={features} />
        <MobilePlaybackVisibility />

        <VideoHotkeys />
        <VideoGestures />
        <StatusAnnouncer />
        <Indicators>
          <SeekIndicator />
        </Indicators>
      </ContainerPrimitive>
    </NeonThemeContext.Provider>
  );
}
