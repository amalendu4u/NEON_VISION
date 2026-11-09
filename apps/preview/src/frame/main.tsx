import { I18nProvider } from '@videojs/react/i18n';
import { type CSSProperties, StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import '@/skin.css';
import './preview.css';
import { playbackProps, playerStyles } from '../shell/params';
import { initialParams, onParamsChange } from './frame';
import { Player } from './player';
import { useBreakpoint } from '../shell/hooks/use-breakpoint';

function Preview() {
  const [params, setParams] = useState(initialParams);
  const normalSidePlaylistAvailable = !useBreakpoint(params.width + 364);

  useEffect(() => onParamsChange(setParams), []);

  return (
    // The provider loads Video.js's built-in translations for the selected language.
    <I18nProvider locale={params.locale}>
      <div
        className="preview-player"
        data-side-playlist={normalSidePlaylistAvailable}
        style={playerStyles(params) as CSSProperties}
      >
        <Player
          media={playbackProps(params)}
          sidePlaylistAvailable={normalSidePlaylistAvailable}
        />
      </div>
    </I18nProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>
);
