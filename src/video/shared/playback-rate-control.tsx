/** @jsxImportSource react */

import { PlaybackRateButton as PlaybackRateButtonPrimitive } from '@videojs/react';

import { cn } from '@/lib/resolve-class-name';

import { Button } from './button';
import { ButtonTooltip } from './tooltip';

export function PlaybackRateControl() {
  return (
    <ButtonTooltip label="Playback Speed">
      <PlaybackRateButtonPrimitive
        render={(props, state) => (
          <Button {...props} className={cn('media-playback-rate-button', props.className)}>
            {state.rate}×
          </Button>
        )}
      />
    </ButtonTooltip>
  );
}
