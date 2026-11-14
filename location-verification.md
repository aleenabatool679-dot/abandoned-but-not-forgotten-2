# NASA location verification

Reviewed: 14 November 2026.

## Scope

The two location panels now cover all 27 Moon and 50 Mars entries supplied for this website. Original data, CSVs and photographs are retained. Location statements displayed in the story passport use a separate NASA-supported crosswalk. Broader original historical/scientific prose has not been comprehensively re-audited in this location task.

## Primary records

- NASA NSSDCA Apollo coordinate table: https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html
- NASA NSSDCA lunar spacecraft and impacts table: https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html
- NASA NSSDCA Apollo ascent-stage/S-IVB impacts: https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_impact.html
- NASA lunar historic-sites report and equipment inventories: https://www.nasa.gov/wp-content/uploads/2023/12/nasa-usg-lunar-historic-sites-reva.pdf
- NASA GISS Mars24 lander coordinates: https://www.giss.nasa.gov/tools/mars24/help/landers.html
- NASA Ingenuity final airfield: https://www.nasa.gov/solar-system/nasas-ingenuity-mars-helicopter-team-says-goodbye-for-now/

The complete source registry, including instrument/debris evidence and Apollo plaque records, is in `data/locations.json`. Every evidence URL is hosted by NASA. A search-indexed NASA educational PDF returned 404 and was replaced with accessible mission-specific NASA plaque records.

## Decisions

- Retain both map panels because official NASA sources document locations for both bodies.
- Use 24 lunar and 10 Martian coordinate-reference markers. Add selectors for every reviewed site, including named-only or estimated locations without coordinate pins.
- List every catalog entry with its supported site associations, citations, and notes; provide search and direct story links.
- A Lunar Module location represents its mission site, not all experiments' individual locations. A Mars rover landing marker is not its current/final location. Instruments travel with their parent rover; landing debris is distributed around a landing area.
- Remove the misleading Ingenuity pin at Perseverance's landing point; name Valinor Hills without inventing final-airfield coordinates.
- Do not plot Mars 2/3/6 estimates, Apollo ascent-stage seismic estimates, Surveyor 2's estimate, or other lunar sites NASA does not classify as LRO-imaged confirmed sites.
- Do not plot unknown Surveyor 4 or Apollo 11/16 ascent-stage positions.
- Do not assign a confirmed location to candidate Pathfinder heat-shield fragments.
- Use NASA's newer published Viking 1 and Pathfinder values from the selected Mars24 reference instead of the borrowed coordinate list. Different NASA historical tables/reference frames can differ; sources are cited explicitly rather than presented as live navigation truth.
- Record NASA-supported additions to incomplete catalog mission groupings and explain duplicate ultraviolet hardware entries.

## Validation

Passed JavaScript and CSS syntax checks, complete per-site catalog-membership comparisons, 77 story-location checks, directory search/empty-state behavior, selected-site deep links, valid NASA-only source hosts, and omission of estimated/unknown pins. All plotted non-Apollo lunar positions were cross-checked with NASA's green/LRO-imaged classification. Full collection, quiz, narration-fallback and saved-story regressions pass. Original catalog/CSV/image checksums are unchanged.

Visual browser QA is unavailable in the selected environment. DOM-based checks do not verify rendered desktop/mobile layout or actual browser console output. Public access is preserved when publishing this update.
