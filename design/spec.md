# NEON VISION — Stage 1 visual spec

## Direction

Premium minimalism with a futuristic neon accent system. Use a near-black frame and a deep blue-gray player surface. Keep the controls legible over variable footage with a restrained dark glass panel and top/bottom scrims. Use the existing Video.js Scaffold icon family and stateful React components; do not add competing icon styles or custom playback state.

## Palette and type

- Frame `#080A10`, panel `#111520`, primary text `#F4F7FB`, secondary text `#9AA4B2`.
- Cyan `#00F5D4` is the primary action and seek start; blue `#38BDF8` is the focus cue; purple `#8B5CF6` and pink `#FF3CAC` appear only in the progress gradient. Green `#B8FF3B` is reserved for occasional positive state.
- Use a system sans stack, tabular figures for time, and existing translated labels.

## Layout and controls

- Preserve the scaffold control order and all existing Video.js behavior.
- Keep the title and screen actions at the top. Float a rounded, inset control panel at the bottom with the seekbar above playback, volume, time, captions, and settings.
- Use a cyan-to-blue-to-purple-to-pink seek fill, a cool gray buffer track, and a softly outlined thumb.
- Use rounded dark controls with a consistent outline icon size and clear play/pause, mute, and fullscreen states. Keep the settings menu opaque enough for contrast and show its existing speed selector.

## States, responsiveness, accessibility

- Retain poster, buffering, playback feedback, and error dialog. Style loading with a quiet cyan indicator and errors with a high-contrast dialog surface.
- Use at least 44px touch targets, a shared blue focus ring, pointer-only hover feedback, and a compact container-query layout for narrow players. Keep menus within the player/viewport width.
- Use the existing Video.js motion tokens and collapse transitions under `prefers-reduced-motion`. Preserve forced-colors and increased-contrast fallbacks.

## Stage 1.5 refinement

- Add a 1px conic-gradient frame with cyan, blue, purple, pink, and softened green accents. Rotate it over 32 seconds, with a restrained outer glow that strengthens slightly on hover and active playback.
- Refine the bottom control surface and floating menus into darker translucent glass with stronger blur, fine borders, and opaque fallbacks for reduced transparency and forced colors.
- Disable frame animation under reduced motion. Keep the frame and focus indicators static and visible in preference modes.

## Stage 1.6 reference-inspired refinement

- Increase the animated perimeter to a clear 2px multicolour ring with cyan, blue, purple, pink, and a softened green stop; add subtle corner colour and a restrained layered glow.
- Strengthen the glass treatment on the controls, central play button, and floating settings surface while retaining opaque preference fallbacks.
- Move the settings trigger to the upper control row and present the existing quality, audio, speed, and captions controls in a headed floating panel.
- Add a responsive UP NEXT panel around the actual preview media. The workbench currently has one Mux video; selecting its sole item restarts that existing stream through the Video.js media API. Additional playlist entries require preview media metadata and sources that are not currently present.
- Keep the preview workbench's options pane separate from the player experience. On wide layouts, the playlist sits beside the player; on narrow layouts, it opens as an overlay drawer without permanently reducing player width.
- Keep the outer layout responsive, keyboard operable, RTL-aware, and preference-aware; do not add immersive dimming or playback dependencies.

## Derived choices

- Rounded surfaces, 18px player corners, 16px control-panel corners, 10px button corners, a 16px glass-panel inset, and a system font stack follow from the supplied premium/minimal brief.

## Stage 1.7 high-fidelity reference refinement

- Use a dark ambient preview canvas with low-contrast color fields and restrained texture around the existing Video.js player.
- Keep the source title and UP NEXT entry at the top. Place the seekbar above a two-sided bottom control row: transport, volume and time on the leading side; playback rate, captions, settings, PiP and fullscreen on the trailing side.
- Keep the working Mux source and one-item UP NEXT preview. Do not add mock navigation, fabricated media, or a metadata card below the player.
- Give the central play action a softly tinted glass surface and keep the 2px animated cyan, blue, purple, pink, and softened green frame visible over footage.
- Preserve the existing Video.js media components and controls, RTL-aware layout, keyboard focus rings, reduced-motion behavior, reduced-transparency fallback, and mobile drawer behavior.

## Stage 1.8 perimeter and control polish

- Make the existing player perimeter visibly travel by removing stationary corner overlays, increasing the conic highlight contrast, and shortening its rotation to 10 seconds. The video frame itself remains stationary; the angle custom property animates only the gradient.
- Add a second masked conic perimeter on the glass control panel with a coordinated 12-second rotation and pointer-events disabled on its pseudo-element.
- Keep both rings static under reduced motion and retain visible high-contrast/forced-color borders.
- Refine the played seek section to cyan-purple-pink, intensify the playhead only while hovered or dragged, and reduce the central play halo to a restrained level.
- Add a cinematic edge vignette, explicit active states for mute/captions/settings, a selected UP NEXT marker, thumbnail edging, and a short playlist fade transition.
