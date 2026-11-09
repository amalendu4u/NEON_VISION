# Feature status

Implementation and verification status for the existing preview and skin. Browser interaction status is called out separately below.

## Current implementation status

- `npm run typecheck` and `npm run build` pass after the latest changes.
- Earlier browser verification covered the default two-item playlist, 16:9 theater layout, mobile toolbar, theme switching/persistence, current-frame PNG capture, chapters, captions, seeking, playback, and volume. This pass changed theater positioning; the revised product-route layout could not be browser-verified in the current execution environment.
- The project preserves the official Video.js v10 React architecture, Mux adapter, Mux-first configured source, Sintel secondary source, Sintel English subtitles, chapter/thumbnail timeline components, error handling, hotkeys, gestures, and status announcer.
- Theme variables now style caption cues, glass menus/popovers, sliders, buttons and the UP NEXT sibling panel. The theme preference remains stored in local storage. Verify cue rendering and immediate theme changes in target browsers.
- Settings and submenu transitions use CSS state and reduced-motion fallbacks; control bar and title use the existing visibility state for vertical entry/exit motion.
- UP NEXT is a fixed-height desktop overlay with a fixed header and independently scrolling item region. It moves below the player on narrow screens. Theater mode hides it without clearing its open state; exiting theater restores it.
- Theater Mode now positions the player against the viewport instead of relying on route wrapper sizing. The player remains mounted during activation and a hidden placeholder preserves the original layout slot. The latest adjustment still needs real-browser checks on `/`, `/player`, `/workbench`, desktop, and mobile.
- Autoplay Next advances to the following configured item only after the current source ends. The toggle is hidden on the final item and when no valid next item exists. It does not enable initial autoplay; the preference persists. Rejected play requests are reported in the preview status region.
- Settings includes a nested real countdown Sleep Timer that pauses the current media through the Video.js media context and clears its interval when inactive or unmounted.
- Autoplay, Theater Mode, UP NEXT, and Chapters use compact toolbar buttons with labels, state, and tooltips. The chapter menu is populated only from real chapter cues exposed by the active source; the current Mux stream has chapter metadata, while Sintel does not.
- Audio Track selection uses Video.js v10's real `AudioTrackRadioGroup`; it depends on actual tracks exposed by the source/adapter and is not guaranteed for the two current sources.
- Save Frames captures the current decoded frame as a PNG. Capture was checked on both Mux and Sintel; the paused playhead remained unchanged. Sequence capture options were removed because seeking did not reliably guarantee unique decoded frames and restoration across sources.

## Browser-checked behaviours

- Play/pause, seeking, volume/mute, settings, source switching, captions on Sintel, and chapter seeking on Mux
- Theme selection across all four themes, including Royal Gold, with persistence after page reload
- 320px mobile single-row controls and rounded video clipping; no overlap observed at 320, 375, 390, or 430px widths
- Desktop playlist overlay geometry, independently scrolling item area, repeated open/close animation, and open-state restoration after Theater mode
- Current-frame PNG export from both sources
- Chapter selection, Escape dismissal, and focus restoration

## Not verified or platform-limited

- Only the configured two-item playlist was exercised in the browser; larger playlist counts were not populated in this pass.
- Playback rate, quality, audio track selection, AirPlay/casting, PiP, and browser fullscreen were not fully verified. PiP is unavailable in this embedded browser. Fullscreen was denied by its host (`TypeError: not granted`).
- Reduced-motion and Windows forced-colors were not emulated. The CSS contains the corresponding adaptations, but those modes need OS/browser validation.
- Sleep timer choices and cancellation were checked; waiting for a full timer expiry and automatic pause was not performed.
- The workbench ratio is 16:9; alternate aspect ratios were not exercised.
- Tooltip offsets are set to a shared 4px value in skin CSS; individual portal tooltip placements were not all measured interactively.
- The browser emitted a React 19 `element.ref` compatibility warning and a host-denied fullscreen request.

## Partial, source-dependent, or not implemented

- Automatic play after source selection can be denied by browser autoplay policy; the viewer can press Play
- Generic HLS through native `<source>` only works where browser/codec support exists; no generic HLS.js engine dependency is installed
- Sintel has no storyboard thumbnail asset; its timeline shows time/chapter preview, not invented thumbnails
- Runtime add/remove/reorder UI is not included; modify/reorder configuration entries instead
- Ambient poster-color sampling is not enabled; selected theme remains the ambient accent
- Clip export is not implemented; see [release assessment](RELEASE.md)
- Time-range and frame-sequence PNG export are not implemented. See [screenshot export](SCREENSHOT-EXPORT.md)
- Voice Boost and Stable Volume are not implemented; Web Audio cannot be safely assumed across the existing Mux/MSE and native media lifecycle without source-specific CORS and browser testing. A single `MediaElementAudioSourceNode` also cannot be reused arbitrarily across remounted elements, and compression alone would not be professional loudness normalization.
- DRM playback and screenshot export from protected streams are unsupported
- Standalone React package bundle and deployed iframe are not provided; see [integration](INTEGRATION.md)
- Screen-reader/browser matrix and Windows forced-colors GUI tests were not run
