/** @jsxImportSource react */

import { Controls } from '@videojs/react';
import type { ReactNode } from 'react';

import { CaptionsToggle } from './captions-button';
import { ControlsContent, type ControlsSlots } from './controls';
import { Title } from './title';
import { VideoBufferingIndicator } from './video-feedback';

export function VideoControlsContent({
  center = false,
  live = false,
  menu,
  playlistToggle,
  topActions,
  rate,
  screenControls,
  toolbarActions,
  renderThumbnail,
  seekBackward,
  seekForward,
}: ControlsSlots & {
  center?: boolean;
  live?: boolean;
  menu?: ReactNode;
  playlistToggle?: ReactNode;
  topActions?: ReactNode;
  screenControls?: ReactNode;
  toolbarActions?: ReactNode;
} = {}) {
  return (
    <>
      <Controls.Backdrop className={'video-controls-backdrop'} />
      <VideoBufferingIndicator />
      <ControlsContent
        captions={!live && <CaptionsToggle />}
        center={center}
        live={live}
        menu={menu}
        renderThumbnail={renderThumbnail}
        rate={rate}
        seekBackward={seekBackward}
        seekForward={seekForward}
        screenControls={screenControls}
        toolbarActions={toolbarActions}
        top={<><Title /><div className="video-controls-top-actions">{playlistToggle}{topActions}</div></>}
      />
    </>
  );
}
