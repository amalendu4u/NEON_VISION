# Accent themes

Settings → Accent Theme opens a nested selector with four coordinated themes:

- **Neon Spectrum** — default cyan, blue, purple, and pink accents
- **Electric Blue** — blue and cyan emphasis with a purple supporting tone
- **Cyber Lime** — lime and cyan emphasis with blue support
- **Royal Gold** — dark espresso surfaces with restrained gold, champagne, and deep-gold accents

The first three themes retain their established dark direction. Royal Gold uses a warmer near-black surface and cream text. The selected ID is exposed as `data-neon-theme` on the skin root and mapped through skin CSS variables; `--media-accent-color` remains supported as a Video.js public override when an embedding application sets it. The chosen theme is stored as `neon-vision-theme` in local storage. If storage is blocked, the selection still applies for the current mounted player and defaults to Neon Spectrum on reload.

The selected accent now also colors supported WebVTT caption cues, glass menus and popovers, menu focus/selection states, the playlist drawer, slider fills and playback controls. Caption styling uses the native `video::cue` path rather than synthetic captions; browser WebVTT styling support varies, and the `::cue` pseudo-element only permits a browser-defined subset of CSS properties. Validate cue backgrounds and colors in each target browser. Theme state is on the skin root and inherited custom properties update immediately without remounting the media element.

Only the accent preset is stored. The preview has its own shell color-scheme option; it does not alter the NEON VISION accent selection.
