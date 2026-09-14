# Runway — gLitCh Labs hero background

## Prompt

A cinematic, almost-black product studio. A large, empty central area is framed by two very soft shafts of cool platinum light falling diagonally through fine atmospheric haze. Beneath the center, a dark brushed-metal surface catches a faint silver reflection, disappearing into charcoal shadow. A subtle light sweep travels slowly across the surface, revealing microscopic metallic texture. Locked-off camera, restrained volumetric lighting, deep blacks, cool graphite and silver palette, photorealistic luxury industrial cinematography. Movement is extremely slow and continuous; the final lighting returns naturally to the opening state for a seamless loop. The middle of the frame stays dark and uncluttered, with ample negative space for a separately composited logo and title. Background only: no text, no symbols, no logos, no objects, no bright flashes, no rapid cuts.

## Composition and delivery

Aim for a 16:9 landscape clip, about 8–10 seconds, exported as H.264 MP4 at 1920×1080 if available. Keep important lighting in the central 40% so cropping on a phone still works. These are creative targets, not model-specific settings. The website places the existing platinum logo and gLitCh Labs title over the footage, preserving their exact appearance.

If the loop has a visible seam, crossfade the end into the beginning in your video editor before export. Save the finished clip to `assets/hero.mp4`, then set the hero video’s `data-src` in `index.html` to that path.

## Optional logo film, for a later replacement

If you want the logo baked into the film instead, use the supplied `assets/glitchlabs.png` as the visual reference:

“The exact supplied platinum gLitCh Labs emblem, centered in a vast dark graphite studio. Preserve every metallic dot, its position, and the rounded square silhouette precisely. A narrow softbox reflection glides slowly across the brushed platinum details while the camera holds steady. Delicate atmospheric haze, deep shadow, subtle silver rim lighting, extremely restrained motion. No logo deformation, no added symbols or lettering, no cuts. A quiet, seamless luxury product reveal.”

For that version, the static logo overlay should be removed only after checking that the generated logo stays faithful. The background-only version is the recommended fit for the current implementation.
