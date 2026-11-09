/** @jsxImportSource react */
import { audioText, captionsText, qualityText, settingsText, speedText } from '@videojs/core/i18n/text/menu';
import { Text as TextPrimitive } from '@videojs/react';
import { isMediaAudioTrackCapable, isMediaPauseCapable, isMediaVideoDimensionsCapable, Menu, useContainer, useMedia } from '@videojs/react';
import {
  ChevronIcon as ChevronIconPrimitive,
  SwitchesIcon as SwitchesIconPrimitive,
  SpeechIcon as SpeechIconPrimitive,
  SpeedIcon as SpeedIconPrimitive,
  CaptionsOffIcon as CaptionsOffIconPrimitive,
  GearIcon as GearIconPrimitive,
} from '@videojs/react/icons/scaffold';
import { AudioTrackRadioGroup } from '@videojs/react/ui/audio-track-radio-group';
import { CaptionsRadioGroup } from '@videojs/react/ui/captions-radio-group';
import { PlaybackRateRadioGroup } from '@videojs/react/ui/playback-rate-radio-group';
import { QualityRadioGroup } from '@videojs/react/ui/quality-radio-group';

import { cn } from '@/lib/resolve-class-name';

import { useEffect, useState, type ReactNode } from 'react';

import { Button } from './button';
import { RadioItem } from './menu-item';
import { ButtonTooltip } from './tooltip';
import { useNeonTheme } from './theme-context';
import { CaptionsToggle } from './captions-button';
import { PiPButton } from './screen-controls';
import type { NeonVisionFeatures } from '../config';

function MenuChevron({ back = false }: { back?: boolean } = {}) {
  return <ChevronIconPrimitive className={back ? 'media-menu-back-chevron' : 'media-menu-forward-chevron'} />;
}

function QualityMenu() {
  return (
    <Menu.Root>
      <QualityRadioGroup.Root>
        <Menu.Trigger className={'media-menu-item'}>
          <SwitchesIconPrimitive className={'media-menu-trigger-icon'} />
          <TextPrimitive token={qualityText.key}>{qualityText.text}</TextPrimitive>
          <span className={'media-menu-hint'}>
            <QualityRadioGroup.Value className={'media-menu-hint-label'} />
            <MenuChevron />
          </span>
        </Menu.Trigger>
        <Menu.Content className={'media-menu-content'}>
          <Menu.Item className={'media-menu-back-item'}>
            <MenuChevron back />
            <TextPrimitive token={qualityText.key}>{qualityText.text}</TextPrimitive>
          </Menu.Item>
          <Menu.Separator className={'media-menu-separator'} />
          <QualityRadioGroup.Options
            className={'media-menu-radio-group'}
            renderItem={(props, item) => (
              <RadioItem {...props}>
                <span>
                  <span>{item.label}</span>
                  {item.tier ? <sup className={'media-menu-tier'}>{item.tier}</sup> : null}
                </span>
                {item.badge ? <span className={'media-menu-badge'}>{item.badge}</span> : null}
              </RadioItem>
            )}
          ></QualityRadioGroup.Options>
        </Menu.Content>
      </QualityRadioGroup.Root>
    </Menu.Root>
  );
}

function AudioTrackMenu() {
  const media = useMedia();
  const [trackCount, setTrackCount] = useState(0);

  useEffect(() => {
    if (!isMediaAudioTrackCapable(media)) {
      setTrackCount(0);
      return;
    }
    const tracks = media.audioTracks;
    const update = () => setTrackCount(tracks.length);
    update();
    tracks.addEventListener('addtrack', update);
    tracks.addEventListener('removetrack', update);
    tracks.addEventListener('change', update);
    return () => {
      tracks.removeEventListener('addtrack', update);
      tracks.removeEventListener('removetrack', update);
      tracks.removeEventListener('change', update);
    };
  }, [media]);

  if (trackCount < 2) return null;

  return (
    <Menu.Root>
      <AudioTrackRadioGroup.Root>
        <Menu.Trigger className={'media-menu-item'}>
          <SpeechIconPrimitive className={'media-menu-trigger-icon'} />
          <TextPrimitive token={audioText.key}>{audioText.text}</TextPrimitive>
          <span className={'media-menu-hint'}>
            <AudioTrackRadioGroup.Value className={'media-menu-hint-label'} />
            <MenuChevron />
          </span>
        </Menu.Trigger>
        <Menu.Content className={'media-menu-content'}>
          <Menu.Item className={'media-menu-back-item'}>
            <MenuChevron back />
            <TextPrimitive token={audioText.key}>{audioText.text}</TextPrimitive>
          </Menu.Item>
          <Menu.Separator className={'media-menu-separator'} />
          <AudioTrackRadioGroup.Options
            className={'media-menu-radio-group'}
            renderItem={(props, item) => (
              <RadioItem {...props}>
                <span>{item.label}</span>
              </RadioItem>
            )}
          ></AudioTrackRadioGroup.Options>
        </Menu.Content>
      </AudioTrackRadioGroup.Root>
    </Menu.Root>
  );
}

function PlaybackRateMenu() {
  return (
    <Menu.Root>
      <PlaybackRateRadioGroup.Root>
        <Menu.Trigger className={'media-menu-item'}>
          <SpeedIconPrimitive className={'media-menu-trigger-icon'} />
          <TextPrimitive token={speedText.key}>{speedText.text}</TextPrimitive>
          <span className={'media-menu-hint'}>
            <PlaybackRateRadioGroup.Value className={'media-menu-hint-label'} />
            <MenuChevron />
          </span>
        </Menu.Trigger>
        <Menu.Content className={'media-menu-content'}>
          <Menu.Item className={'media-menu-back-item'}>
            <MenuChevron back />
            <TextPrimitive token={speedText.key}>{speedText.text}</TextPrimitive>
          </Menu.Item>
          <Menu.Separator className={'media-menu-separator'} />
          <PlaybackRateRadioGroup.Options
            className={'media-menu-radio-group'}
            renderItem={(props, item) => (
              <RadioItem {...props}>
                <span>{item.label}</span>
              </RadioItem>
            )}
          ></PlaybackRateRadioGroup.Options>
        </Menu.Content>
      </PlaybackRateRadioGroup.Root>
    </Menu.Root>
  );
}

function CaptionsMenu() {
  return (
    <Menu.Root>
      <CaptionsRadioGroup.Root>
        <Menu.Trigger className={'media-menu-item'}>
          <CaptionsOffIconPrimitive className={'media-menu-trigger-icon'} />
          <TextPrimitive token={captionsText.key}>{captionsText.text}</TextPrimitive>
          <span className={'media-menu-hint'}>
            <CaptionsRadioGroup.Value className={'media-menu-hint-label'} />
            <MenuChevron />
          </span>
        </Menu.Trigger>
        <Menu.Content className={'media-menu-content'}>
          <Menu.Item className={'media-menu-back-item'}>
            <MenuChevron back />
            <TextPrimitive token={captionsText.key}>{captionsText.text}</TextPrimitive>
          </Menu.Item>
          <Menu.Separator className={'media-menu-separator'} />
          <CaptionsRadioGroup.Options
            className={'media-menu-radio-group'}
            renderItem={(props, item) => (
              <RadioItem {...props}>
                <span>{item.label}</span>
              </RadioItem>
            )}
          ></CaptionsRadioGroup.Options>
        </Menu.Content>
      </CaptionsRadioGroup.Root>
    </Menu.Root>
  );
}

const THEME_PRESETS = [
  { id: 'spectrum', label: 'Neon Spectrum', colors: ['#00f5d4', '#8b5cf6', '#ff3cac'] },
  { id: 'blue', label: 'Electric Blue', colors: ['#38bdf8', '#00f5d4', '#8b5cf6'] },
  { id: 'lime', label: 'Cyber Lime', colors: ['#b8ff3b', '#00f5d4', '#38bdf8'] },
  { id: 'gold', label: 'Royal Gold', colors: ['#d4af37', '#f5d98e', '#8f6b1f'] },
] as const;

function ThemeSelector() {
  const neonTheme = useNeonTheme();
  const theme = neonTheme?.theme ?? 'spectrum';

  const select = (value: string) => {
    const preset = THEME_PRESETS.find(({ id }) => id === value);
    if (preset) neonTheme?.setTheme(preset.id);
  };

  const selectedLabel = THEME_PRESETS.find(({ id }) => id === theme)?.label ?? 'Neon Spectrum';
  const selectedPreset = THEME_PRESETS.find(({ id }) => id === theme) ?? THEME_PRESETS[0];

  return (
    <Menu.Root>
      <Menu.Trigger className="media-menu-item media-theme-trigger">
        <span>Accent Theme</span>
        <span className="media-menu-hint">
          <span className="media-theme-trigger-swatch" aria-hidden="true" style={{ backgroundColor: selectedPreset.colors[0] }} />
          <span className="media-menu-hint-label">{selectedLabel}</span>
          <MenuChevron />
        </span>
      </Menu.Trigger>
      <Menu.Content className="media-menu-content media-theme-submenu">
        <Menu.Item className="media-menu-back-item">
          <MenuChevron back />
          <span>Accent Theme</span>
        </Menu.Item>
        <Menu.Separator className="media-menu-separator" />
        <Menu.RadioGroup className="media-theme-options" value={theme} onValueChange={select} aria-label="Accent theme">
          {THEME_PRESETS.map((preset) => (
            <RadioItem className="media-theme-option" key={preset.id} value={preset.id}>
              <span className="media-theme-swatches" aria-hidden="true">
                {preset.colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}
              </span>
              <span>{preset.label}</span>
            </RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function KeyboardShortcutsMenu() {
  const shortcuts = [
    ['Play / Pause', 'K'],
    ['Seek backward / forward', '← / →'],
    ['Volume down / up', '↓ / ↑'],
    ['Playback speed slower / faster', '[ / ]'],
    ['Captions', 'C'],
    ['Theater Mode', 'T'],
    ['Picture-in-Picture', 'P'],
    ['Fullscreen', 'F'],
  ] as const;

  return (
    <Menu.Root>
      <Menu.Trigger className="media-menu-item">
        <span>Keyboard Shortcuts</span>
        <span className="media-menu-hint"><MenuChevron /></span>
      </Menu.Trigger>
      <Menu.Content className="media-menu-content media-shortcuts-submenu">
        <Menu.Item className="media-menu-back-item">
          <MenuChevron back />
          <span>Keyboard Shortcuts</span>
        </Menu.Item>
        <Menu.Separator className="media-menu-separator" />
        <div className="media-shortcut-reference" role="group" aria-label="Keyboard shortcuts">
          {shortcuts.map(([label, keys]) => (
            <div className="media-shortcut-row" key={label}>
              <span>{label}</span><kbd>{keys}</kbd>
            </div>
          ))}
          <p>Also: Space plays or pauses; M mutes; J/L seek; 0–9 seek by percentage; Home/End jump to the start/end.</p>
        </div>
      </Menu.Content>
    </Menu.Root>
  );
}

export function MoreControls({ theaterAction }: { theaterAction?: ReactNode }) {
  return (
    <div className="neon-more-controls">
      <Menu.Root side="top" align="end">
        <ButtonTooltip label="More controls">
          <Menu.Trigger render={<Button className="neon-more-controls-trigger" aria-label="More controls" />}>
            <svg className="media-button-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" />
            </svg>
          </Menu.Trigger>
        </ButtonTooltip>
        <Menu.Popup className="media-popup media-menu-popup neon-more-controls-popup">
          <Menu.Content className="media-menu-content neon-more-controls-content">
            <CaptionsToggle />
            <PiPButton />
            {theaterAction}
          </Menu.Content>
        </Menu.Popup>
      </Menu.Root>
    </div>
  );
}

function findVideo(media: unknown, container: HTMLElement | null) {
  return media instanceof HTMLVideoElement ? media : container?.querySelector('video') ?? null;
}

function canvasPng(video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<Blob> {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  if (!context) return Promise.reject(new Error('Canvas is unavailable.'));
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not encode this frame as PNG.')), 'image/png');
  });
}

function downloadPng(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function FrameCaptureMenu() {
  const media = useMedia();
  const container = useContainer();
  const [message, setMessage] = useState('');

  const captureCurrent = async () => {
    const video = findVideo(media, container);
    if (!video || !isMediaVideoDimensionsCapable(video) || !video.videoWidth || !video.videoHeight || video.readyState < 2) {
      setMessage('The current video frame is not ready to capture.');
      return;
    }
    try {
      const blob = await canvasPng(video, document.createElement('canvas'));
      downloadPng(blob, 'NEON_VISION_Frame_001.png');
      setMessage('Current frame PNG generated.');
    } catch (error) {
      setMessage(error instanceof Error ? `Capture failed: ${error.message}` : 'Capture was blocked by this source or browser.');
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger className="media-menu-item">
        <span>Save Frames</span>
        <span className="media-menu-hint"><span className="media-menu-hint-label">PNG</span><MenuChevron /></span>
      </Menu.Trigger>
      <Menu.Content className="media-menu-content">
        <Menu.Item className="media-menu-back-item"><MenuChevron back /><span>Back to Save Frames</span></Menu.Item>
        <Menu.Separator className="media-menu-separator" />
        <button className="media-menu-item media-screenshot-button" type="button" onClick={() => void captureCurrent()}>
          <span>Capture Current Frame</span>
        </button>
        <span className="media-screenshot-status" role="status" aria-live="polite">{message}</span>
      </Menu.Content>
    </Menu.Root>
  );
}

const SLEEP_OPTIONS = [10, 20, 30, 60] as const;

function SleepTimer() {
  const media = useMedia();
  const [deadline, setDeadline] = useState<number | null>(null);
  const [selectedMinutes, setSelectedMinutes] = useState('off');
  const [now, setNow] = useState(() => Date.now());
  const [announcement, setAnnouncement] = useState('');
  const remainingMs = deadline === null ? 0 : Math.max(0, deadline - now);
  const timeLabel = `${String(Math.floor(remainingMs / 60_000)).padStart(2, '0')}:${String(Math.floor((remainingMs % 60_000) / 1000)).padStart(2, '0')}`;

  useEffect(() => {
    if (deadline === null) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [deadline]);

  useEffect(() => {
    if (deadline === null || deadline > now) return;
    const canPause = isMediaPauseCapable(media);
    if (canPause) media.pause();
    setDeadline(null);
    setSelectedMinutes('off');
    setAnnouncement(canPause ? 'Sleep timer ended. Playback paused.' : 'Sleep timer ended, but this media cannot be paused.');
  }, [deadline, media, now]);

  const choose = (value: string) => {
    if (value === 'off') {
      setDeadline(null);
      setSelectedMinutes('off');
      setAnnouncement('Sleep timer cancelled.');
      return;
    }
    const minutes = Number(value);
    if (Number.isFinite(minutes) && minutes > 0) {
      const current = Date.now();
      setNow(current);
      setDeadline(current + minutes * 60_000);
      setSelectedMinutes(value);
      setAnnouncement(`Sleep timer set for ${minutes} minutes.`);
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger className="media-menu-item">
        <span>Sleep Timer</span>
        <span className="media-menu-hint">
          <span className="media-menu-hint-label">{deadline === null ? (selectedMinutes === 'off' ? 'Off' : `${selectedMinutes} min`) : timeLabel}</span>
          <MenuChevron />
        </span>
      </Menu.Trigger>
      <Menu.Content className="media-menu-content">
        <Menu.Item className="media-menu-back-item">
          <MenuChevron back />
          <span>Back to Sleep Timer</span>
        </Menu.Item>
        <Menu.Separator className="media-menu-separator" />
        <section className="media-sleep-timer" aria-label="Sleep timer duration">
          <h3>PAUSE AFTER</h3>
          <Menu.RadioGroup className="media-sleep-options" value={selectedMinutes} onValueChange={choose} aria-label="Sleep timer duration">
            <RadioItem className="media-sleep-option" value="off"><span>Off</span></RadioItem>
            {SLEEP_OPTIONS.map((minutes) => (
              <RadioItem className="media-sleep-option" key={minutes} value={String(minutes)}>
                <span>{minutes} minutes</span>
              </RadioItem>
            ))}
          </Menu.RadioGroup>
          <p className="media-sleep-remaining" aria-live="off">{deadline === null ? '' : `Pausing in ${timeLabel}`}</p>
          <p className="media-sleep-status" role="status" aria-live="polite">{announcement}</p>
        </section>
      </Menu.Content>
    </Menu.Root>
  );
}

export function SettingsMenu({ features }: { features?: NeonVisionFeatures } = {}) {
  const enabled = { sleepTimer: true, screenshotExport: true, ...features };
  return (
    <Menu.Root side="top" align="end">
      <ButtonTooltip label={<TextPrimitive token={settingsText.key}>{settingsText.text}</TextPrimitive>}>
        <Menu.Trigger render={<Button className={'media-settings-trigger'} />}>
          <GearIconPrimitive className={'media-button-icon'} />
          <TextPrimitive className={'media-settings-button-label'} token={settingsText.key}>
            {settingsText.text}
          </TextPrimitive>
        </Menu.Trigger>
      </ButtonTooltip>
      <Menu.Popup keepMounted className={cn('media-popup', 'media-popup-safe-area', 'media-menu-popup', 'media-settings-panel')}>
        <Menu.Content className={'media-menu-content'}>
          <div className={'media-settings-heading'}>
            <span>PLAYER SETTINGS</span>
            <span className={'media-settings-active'}><span aria-hidden="true" />ACTIVE</span>
          </div>
          <QualityMenu />
          <AudioTrackMenu />
          <PlaybackRateMenu />
          <CaptionsMenu />
          <ThemeSelector />
          <KeyboardShortcutsMenu />
          {enabled.sleepTimer && <SleepTimer />}
          {enabled.screenshotExport && <>
            <Menu.Separator className={'media-menu-separator'} />
            <FrameCaptureMenu />
          </>}
        </Menu.Content>
      </Menu.Popup>
    </Menu.Root>
  );
}
