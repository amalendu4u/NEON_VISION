# Screenshot export

Settings → Save Frames contains Capture Current Frame. It exports the currently decoded frame as a PNG without seeking, so it leaves the playhead and playback state unchanged. The 10/20/30-frame sequence options were removed because real source/browser seeking did not reliably guarantee distinct decoded frames and a reliable restore path.

Canvas export remains subject to browser origin-clean rules. The media host must grant the page origin CORS access; setting `crossOrigin="anonymous"` alone is not sufficient. `drawImage` or `toBlob` may fail for cross-origin, DRM-protected, or otherwise restricted sources. The errors are caught and displayed. Test Mux and Sintel separately in the target browser and deployment origin. These actions export still images only; they do not export a video clip.
