# Abandoned but not Forgotten

Team After the Landing · NASA Space App Challenge, Peshawar.

A dependency-free educational website built from the supplied 27-entry Moon catalog, 50-entry Mars catalog and 77-entry NASA image reference list.

## Open the website

Open `dist/index.html` directly in a modern browser. All data, hardware photos and backgrounds are included locally. An internet connection loads the optional Google Fonts and opens NASA source links; system font fallbacks work offline.

Alternatively, serve `dist` with any static web server. For example:

```sh
python3 -m http.server 3000 --directory dist
```

Visit http://localhost:3000. Upload the contents of `dist` to GitHub Pages or another static host to publish independently.

## Pages and editing

- `index.html`, `index.css`, `index.js`: home, destinations, project and sources.
- `moon.html`, `moon.css`, `moon.js`: 27 Moon catalog entries.
- `mars.html`, `mars.css`, `mars.js`: 50 Mars catalog entries.
- `story.html`, `story.css`, `story.js`: complete story for a selected entry. Example: `story.html?id=mars-09`.
- `shared.css`, `shared.js`: shared navigation, card rendering, image fallback, saved stories.
- `collection.css`, `collection.js`: shared collection layout, search and filters.
- `data/hardware.json`: readable enriched data, preserving each original catalog row.
- `data/hardware.js`: the same dataset loaded synchronously so file-based viewing works. When editing the JSON, regenerate this file as `window.HARDWARE = <JSON>;`.
- `data/*.csv`: unchanged original CSVs.
- `assets/`: locally stored images; each image is mapped to a NASA archive record in the dataset.

The dedicated page files keep each interface editable while shared files avoid duplicating common code. Saved stories use browser localStorage; no account or server is required. Sharing a file-based URL does not publish it to the internet.

## Editorial notes

The catalog contains entries, not 77 unique spacecraft. Some entries group multiple missions; instruments can also be listed separately from their parent rover. The Apollo 16 ultraviolet telescope appears under two names. Soviet and Chinese hardware is identified separately from NASA missions.

Moon dates are supplementary deployment/mission ranges. Mars dates are the supplied arrival years. Status follows the catalog, with historical clarifications, and is not a live operational feed. An instrument can be retired while its parent rover remains active. The term “ongoing science / catalog active” reflects this distinction.

Scientific contributions and explanations supplement the CSVs. Imagined first-person lines are labeled as storytelling. No claim is made that an instrument detected life. Viking seismometer limitations and the overlapping Apollo ultraviolet entries have specific notes.

NASA photographs can show models, engineering tests, larger assemblies, candidate landing sites, or mission context. Captions and linked NASA records identify these cases. Some isolated hardware photographs could not be obtained; those entries use labeled contextual images. NASA image metadata and credits are included in each story. Decorative backgrounds were retrieved from the user-provided reference site; they are not represented as documentary hardware photographs. NASA links do not imply endorsement.

Two supplied NASA overview URLs returned 404. Website links point to working official pages, while original URLs remain in `providedSource` and the CSVs.

## Validation

JavaScript syntax checked with Node. DOM-based functional checks covered all 77 stories, collection search, status filters, save/unsave, empty states, resets, quiz feedback and invalid story IDs. All local HTML asset links and required data fields were checked; all JPEG files decoded successfully. NASA information endpoints were checked and broken overview links replaced.

Visual browser QA could not be performed because the environment did not expose its browser-control tool. Responsive layouts and accessibility features are implemented but their rendering has not been visually verified.

## Aerospace visual redesign

The existing pages have been restyled in place, preserving all original HTML text, IDs, classes, images, source links, CSVs and catalog data. The new home hero uses the requested “ABUNDANT BUT NOT FORGOTTEN” title; the original “Abandoned but not Forgotten” identity remains visible and in the original project content.

The shared design uses Space Grotesk headings, Inter body text, JetBrains Mono archive labels and selected Orbitron date labels. The Moon uses silver-blue slate panels; Mars uses warm rust glass and orange edges. Cards expose a native expandable science summary while preserving their original story links and save buttons.

`motion.js` adds the responsive menu, true scroll progress, IntersectionObserver reveals, a lightweight canvas atmosphere, restrained hero parallax and a persistent motion pause control. It respects the operating system’s reduced-motion setting, stops canvas work offscreen or when the document is hidden, caps canvas resolution, and uses no animation libraries. The historical timeline is generated from existing catalog records and links to their original story pages. Labels describe archive content, not simulated live telemetry.

See `redesign-validation.md` for preservation and verification results. The ZIP download contains this latest source.

## Current reference-site presentation

The current visual design follows the user-provided reference at https://aleenabatool679-dot.github.io/Abandoned-but-not-forgotten/ rather than the earlier mission-control treatment. Shared typography, pill navigation, page backgrounds, circular planet icons, source SVG illustrations, maps and alternating chapter panels use the reference's design assets and styling. No Beyond section is added.

Each world now has six featured stories followed by its complete searchable catalog. The Moon features the catalog's lunar module descent stage, lunar rover, Passive Seismic Experiment, retroreflector, MET and Surveyor landers. The reference's ALSEP package and Surveyor 3 are broader/narrower than the supplied catalog entries, so the website retains the supplied catalog names and facts instead of replacing them. Mars features Viking 1, Sojourner, Spirit, Opportunity, InSight and Ingenuity. All 77 catalog entries, CSVs, original photographs and NASA links remain unchanged.

The reference uses photographs for its Moon chapters and line-art SVGs for its Mars chapters. This distinction is retained, with a NASA photograph also shown beneath every Mars illustration. The animated home globe textures come from the reference and are procedural illustrations, not NASA surface photographs. Landing-site maps are adapted from the reference with their approximate-location labels and provenance. Map links now open the corresponding catalog stories.

Current presentation files:

- `shared.css`, `index.css`, `moon.css`, `mars.css`: styling taken from the reference.
- `reference-adapter.css`: compatibility styling for the existing page structures and complete catalogs.
- `reference-explorer.css`: the reference's explorer and map styling.
- `reference-icons.js`: the reference's six Mars SVG illustrations and selected visual mappings; no replacement mission data.
- `chapters.js`: six featured stories per world, rendered from the existing dataset, plus speech narration with text fallback.
- `globe-textures.js`, `reference-globes.js`: reference planet illustrations and rotating sphere renderer.
- `reference-moonmap.js`, `reference-marsmap.js`: reference landing-site maps adapted to existing story IDs.
- `reference-motion.js`: current motion preference, reveals and reading progress.

The previous `motion.js` is retained in source but is not loaded by current pages. Narration depends on browser speech synthesis; the complete text is available when it is unsupported. No external audio service or new dependency is required.

## NASA location audit and expanded maps

The current maps have superseded the borrowed six-site coordinate lists. All 77 catalog entries now have a location-evidence directory record, and all individual story pages show this source-checked location information instead of the old unsourced location label. The original CSVs, enriched catalog records and images are preserved.

- `data/locations.json` and `data/locations.js` hold the NASA source registry, 45 site records, hardware-to-site associations, evidence notes and explicit exclusions.
- `verified-locations.js` renders both maps and complete entry directories and replaces the story's location field with NASA-supported associations.
- `verified-locations.css` styles the selectors, source links, searchable entity directories and evidence details.
- `reference-moonmap.js` and `reference-marsmap.js` now only initialize the NASA-backed map renderer.

The Moon map has 31 NASA-sourced site records and 24 plotted coordinate references. Apollo markers use NASA's Lunar Module coordinate table; other plotted lunar sites are marked as LRO-imaged in NASA's spacecraft/impact table. Approximate or seismic-estimate locations remain documented but receive no confirmed pin. Surveyor 4 and the Apollo 11/16 ascent stages have no pins because NASA lists their locations as unknown.

The Mars directory has 14 NASA-sourced location records and 10 landing-reference markers, using NASA GISS Mars24. Landing coordinates are not presented as rover current/final positions or as exact instrument/debris coordinates. Ingenuity's NASA-named final airfield, Valinor Hills, has no numerical pin. Mars 2/3/6 estimates have no pins. NASA describes possible Pathfinder heat-shield fragments rather than a confirmed individual location, so that entry is explicitly unassociated with a confirmed map position.

NASA's historic lunar inventory and mission/instrument pages support the hardware associations. Corrections to incomplete CSV mission groupings are recorded as location notes (for example, additional magnetometer, solar-wind spectrometer and cold-cathode-gauge deployments). Overlapping ultraviolet entries are not treated as unique instruments. The original catalog content is available unchanged; the crosswalk distinguishes NASA-reviewed associations from the original labels.

This is a location verification of the supplied 77-entry catalog, not a complete NASA inventory of every object ever sent into space and not a live operations/status feed. See `location-verification.md` for the audit scope and checks.

## Combined Explore page

`explore.html`, `explore.css` and `explore.js` provide the complete 77-entry catalog. Every navigation bar's Explore link now opens this page. It defaults to all worlds and supports Moon (27) and Mars (50) filters alongside the existing search, category, status, sorting, reset and saved-story controls. Moon and Mars pages continue to show their own catalogs. The collection renderer supports an optional world filter without changing any catalog data.

## Static location maps and home-page cleanup

Both Moon and Mars map columns now use normal document positioning, with no sticky offset, so the diagrams cannot float over later text while scrolling. The home-page featured-story block (“Small machines. Giant legacies.”) and history timeline (“History, one artifact at a time.”) have been removed along with their home-page rendering code. The quiz, destination links, complete planetary catalogs and all-77-entry Explore page remain available.


## MCQs page

`mcqs.html`, `mcqs.css` and `mcqs.js` provide 20 easy questions: 10 Moon and 10 Mars questions grounded in the existing hardware catalog. The MCQs navigation item sits between Explore and About on all six pages. The former Mission Check section and its code have been removed from the Archive.

The page provides separate Moon/Mars tabs, native radio choices, immediate explanations, related story/NASA links, answered-question progress and scores. Selections persist while switching worlds during the visit; restart clears only the selected world. No login, external service or new dependency is required.
