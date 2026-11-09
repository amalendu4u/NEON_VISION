/** @jsxImportSource react */

import { Controls } from '@videojs/react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/resolve-class-name';

import { SeekButton } from './shared/seek-button';
import { ScreenControls } from './shared/screen-controls';
import { MoreControls, SettingsMenu } from './shared/settings-menu';
import type { ThumbnailSlot } from './shared/time-slider';
import { VideoControlsContent } from './shared/video-controls';
import type { NeonVisionFeatures } from './config';

export function VideoControls({ renderThumbnail, playlistToggle, topActions, toolbarActions, features }: ThumbnailSlot & { playlistToggle?: ReactNode; topActions?: ReactNode; toolbarActions?: ReactNode; features?: NeonVisionFeatures } = {}) {
  return (
    <Controls.Root>
      <VideoControlsContent
        center
        menu={<SettingsMenu features={features} />}
        playlistToggle={playlistToggle}
        topActions={topActions}
        renderThumbnail={renderThumbnail}
        screenControls={<ScreenControls />}
        toolbarActions={<>{toolbarActions}<MoreControls theaterAction={features?.theaterMode === false ? undefined : toolbarActions} /></>}
        seekBackward={
          <SeekButton
            className={cn('video-controls-center-button', 'video-controls-center-seek')}
            iconClassName={'video-controls-center-seek-icon'}
            seconds={-10}
            tooltip={false}
          />
        }
        seekForward={
          <SeekButton
            className={cn('video-controls-center-button', 'video-controls-center-seek')}
            iconClassName={'video-controls-center-seek-icon'}
            seconds={10}
            tooltip={false}
          />
        }
      />
    </Controls.Root>
  );
}
