# Reference-site presentation validation

Reference: https://aleenabatool679-dot.github.io/Abandoned-but-not-forgotten/

## Passed

- Retrieved and inspected the reference's Home, Moon and Mars HTML, stylesheets, chapter scripts, SVGs, globe renderer, textures, explorer styles and map scripts.
- Imported its visual assets and styles, adapting navigation and map links to the existing website. No Beyond page or link was introduced.
- All original catalog datasets, CSVs and 80 JPEG assets remain byte-identical.
- The home page contains two rotating illustrated planetary icons. Both planetary pages contain six featured stories and a complete searchable catalog (27 Moon / 50 Mars entries).
- The six Mars SVG drawings are copied from the reference. The Moon reference uses photographic chapter artwork; the corresponding original NASA photographs are retained. Illustrations and documentary/context photographs remain labeled.
- All local HTML navigation/resource targets exist; all JPEG files decode; current JavaScript and CSS pass syntax parsing.
- Original functional regression checks pass: home quiz, Moon and Mars search, status filters, reset, save/unsave, saved-only and empty states, all 77 individual stories and invalid-story handling.
- Integrated page scripts execute without exceptions in the DOM harness on Home, Moon, Mars and Story.
- New checks pass for six featured chapters per world, six NASA photographs in each featured section, six Mars illustrations, six selectable sites on each map, map-to-story links, narration's text fallback and stop/hide controls, voice preference toggle and duplicate-ID detection.
- Motion pause/resume and operating-system reduced-motion preferences pass on all page types. Content remains visible with reduced motion.

## Visual verification limit

The environment does not expose the managed browser-control tool. Desktop/mobile rendering, computed visual comparisons, native speech voices and real browser console output could not be checked. DOM-based functional checks do not establish pixel-perfect fidelity. Reference HTML, CSS and visual assets were inspected directly; actual browser QA remains pending.
