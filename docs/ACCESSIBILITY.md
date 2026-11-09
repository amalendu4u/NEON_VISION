# Accessibility

NEON VISION uses the accessible Video.js React controls and retains the skin’s error dialog, hotkeys, gestures, and `StatusAnnouncer`. Custom theme and screenshot actions are labeled buttons and have visible focus. Touch targets for those actions are at least 44px high. Selection state is conveyed through `aria-pressed` as well as accent styling.

## Keyboard shortcuts

Shortcuts are player-scoped and work after focus enters the player:

| Key | Action |
| --- | --- |
| Space or K | Play/pause |
| M | Mute/unmute |
| Left / Right arrows, J / L | Seek backward/forward by the Video.js default step (10 seconds) |
| Up / Down arrows | Change volume |
| 0–9 | Seek to 0–90% |
| Home / End | Seek to start/end |
| < / > | Decrease/increase playback rate |
| F | Fullscreen |
| C | Toggle subtitles |
| I | Picture-in-picture |
| Escape | Close an open Video.js menu/dialog or UP NEXT overlay |

Editable fields are protected by Video.js hotkey handling. Menus support arrow navigation, Enter/Space selection, Escape close, and submenu back navigation. UP NEXT moves focus to its close button when opened, closes on Escape, and restores focus to its trigger. Autoplay and Theater Mode expose their current state with `aria-pressed`; timer changes and rejected playback requests use status announcements. Browser/player support determines whether PiP, fullscreen, and media keys are available.

## Preferences and testing

Skin rules include reduced-motion and forced-colors fallbacks. Reduced motion removes decorative perimeter, drawer, menu and control transitions while retaining player state and control feedback. Forced colors use system colors and visible borders. RTL direction uses logical CSS properties and React menu focus order follows the DOM order; the playlist drawer enters from the logical inline end.

Automated accessibility conformance, screen-reader matrix testing, and Windows High Contrast GUI testing are not included in the project build. Test with keyboard-only navigation, a screen reader, browser zoom, and Windows forced-colors mode before release.
