/** @jsxImportSource react */

import { ErrorDialog as ErrorDialogPrimitive } from '@videojs/react';
import { selectError, useContainer, useMedia, usePlayer } from '@videojs/react';

import { Button } from './button';

export function ErrorDialog() {
  const container = useContainer();
  const media = useMedia();
  const error = usePlayer(selectError);
  const retry = () => {
    const video = media instanceof HTMLMediaElement ? media : container?.querySelector('video');
    if (!video) return;
    error?.dismissError();
    video.load();
    void video.play().catch(() => undefined);
  };

  return (
    <ErrorDialogPrimitive.Root>
      <ErrorDialogPrimitive.Backdrop className={'media-dialog-backdrop'} />
      <ErrorDialogPrimitive.Popup className={'media-dialog-popup'}>
        <ErrorDialogPrimitive.Title className={'media-dialog-title'} />
        <ErrorDialogPrimitive.Description className={'media-dialog-description'} />
        <div className="media-error-actions">
          <button className="media-button media-error-retry" type="button" onClick={retry}>Retry playback</button>
          <ErrorDialogPrimitive.Close render={<Button />} className={'media-dialog-close'} />
        </div>
      </ErrorDialogPrimitive.Popup>
    </ErrorDialogPrimitive.Root>
  );
}
