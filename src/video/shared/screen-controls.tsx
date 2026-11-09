/** @jsxImportSource react */

import {
  CastButton as CastButtonPrimitive,
  PiPButton as PiPButtonPrimitive,
  FullscreenButton as FullscreenButtonPrimitive,
} from '@videojs/react';
import {
  CastEnterIcon as CastEnterIconPrimitive,
  CastExitIcon as CastExitIconPrimitive,
  PipEnterIcon as PipEnterIconPrimitive,
  PipExitIcon as PipExitIconPrimitive,
  FullscreenEnterIcon as FullscreenEnterIconPrimitive,
  FullscreenExitIcon as FullscreenExitIconPrimitive,
} from '@videojs/react/icons/scaffold';

import { cn } from '@/lib/resolve-class-name';

import { AirPlayButton } from './airplay-button';
import { Button } from './button';
import { ButtonTooltip } from './tooltip';

function CastButton() {
  return (
    <ButtonTooltip label="Start casting" popupClassName={'media-tooltip-screen-popup'}>
      <CastButtonPrimitive label="Cast" render={<Button />} className={'media-cast-button'}>
        <CastEnterIconPrimitive className={cn('media-button-icon', 'media-cast-button-enter-icon')} />
        <CastExitIconPrimitive className={cn('media-button-icon', 'media-cast-button-exit-icon')} />
      </CastButtonPrimitive>
    </ButtonTooltip>
  );
}

export function PiPButton() {
  return (
    <ButtonTooltip label="Picture-in-Picture" shortcutLabel="P" popupClassName={'media-tooltip-screen-popup'}>
      <PiPButtonPrimitive label="Picture-in-Picture" render={<Button />} className={'media-pip-button'}>
        <PipEnterIconPrimitive className={cn('media-button-icon', 'media-pip-button-enter-icon')} />
        <PipExitIconPrimitive className={cn('media-button-icon', 'media-pip-button-exit-icon')} />
      </PiPButtonPrimitive>
    </ButtonTooltip>
  );
}

function FullscreenButton() {
  return (
    <ButtonTooltip label="Fullscreen" shortcutLabel="F" popupClassName={'media-tooltip-screen-popup'}>
      <FullscreenButtonPrimitive label="Fullscreen" render={<Button />} className={'media-fullscreen-button'}>
        <FullscreenEnterIconPrimitive className={cn('media-button-icon', 'media-fullscreen-button-enter-icon')} />
        <FullscreenExitIconPrimitive className={cn('media-button-icon', 'media-fullscreen-button-exit-icon')} />
      </FullscreenButtonPrimitive>
    </ButtonTooltip>
  );
}

export function ScreenControls() {
  return (
    <>
      <AirPlayButton popupClassName={'media-tooltip-screen-popup'} />
      <CastButton />
      <PiPButton />
      <FullscreenButton />
    </>
  );
}
