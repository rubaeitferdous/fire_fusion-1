# FireFusion Prototype (v14)

A single-file, clickable prototype of the FireFusion sensor-harmonized wildfire
intelligence interface. It shows how satellite fire detections are presented,
how their evidence is displayed, and which results are not yet available.

**This is not a wildfire prediction tool.** It does not model spread, danger, or
evacuation routes. Keep this statement in any demonstration.

---

## Files

| File | Purpose |
|---|---|
| `FireFusion_Prototype_v14.html` | The whole prototype: markup, styles, scripts and embedded fonts. Open in a browser. |
| `docs/DATA_CONTRACT.md` | Every data shape the UI reads, its source, and what is still a fixture. |
| `README.md` | This file. |

## Running it

1. Open `FireFusion_Prototype_v14.html` in a modern browser (Chrome, Edge, Firefox or Safari).
2. No build step, server, or internet connection is required. Fonts are embedded.
3. Keyboard shortcuts: `1` Overview, `2` Map, `3` Calendar, `4` Cluster, `5` Validation, `6` Methods.

## Screens

1. **Overview**: summary, pipeline stages, and dataset identifiers.
2. **Map**: fire detections for one date. Raw / Harmonized toggle, confidence filters, zoom, and a popover per event.
3. **Calendar**: daily counts for the year. Selecting a day updates the detail panel and the Map.
4. **Cluster evidence**: detail for one event. Opens directly with the highest-confidence cluster if none is selected.
5. **Validation**: planned validation checks, all marked "Not yet run".
6. **Methods & limitations**: the scientific method, with a table of contents.

## What is real and what is not

Read `docs/DATA_CONTRACT.md` for the full list. In short:

- **Real in intent**: the structure of each screen, the labels, the honest "not available" states.
- **Fixture (replace)**: all cluster data, the calendar counts, the map positions.
- **Illustrative (remove before claiming real data)**: calendar sample days other than 15 Mar 2026, and the score breakdown bars on the Cluster screen.
- **Not implemented**: validation results, anomaly percentile, event score, score components, MCD64A1 cross-check.

The "Run validation" button is a timed demo. It computes nothing.

## Structure of the code

The file has three parts, in order:

1. **`<style>`**: design tokens (`:root` variables), layout, and component styles. Embedded fonts are at the top of this block.
2. **Markup**: six `<section class="screen">` elements, one per screen. Navigation is in `<nav class="topnav">`.
3. **`<script>`**: one block, organised by comment headers:
   - `NAVIGATION`: `goScreen()` switches screens.
   - `SCREEN 2: MAP`: `clusterData`, `MAP_DATA_BY_DATE`, `renderMap()`, `setMapDate()`, popover and zoom.
   - `SCREEN 3: CALENDAR`: `CALENDAR_FIXTURE`, `buildCalendar()`, `renderAnomalyFor()`.
   - `SCREEN 4: CLUSTER EVIDENCE`: `renderClusterEvidence()`, `pickDefaultCluster()`, `renderIllustrativeBreakdown()`.
   - `VALIDATION`: `runValidationDemo()`.
   - `METHODS`: table-of-contents scroll and highlight.

## Connecting to a backend

Do this in order:

1. Replace `clusterData` and `MAP_DATA_BY_DATE` with a fetch that returns clusters for a given date. Keep the field names in the data contract, or update the contract together with the code.
2. Replace `CALENDAR_FIXTURE` with a fetch of `agg_daily` for the displayed year. Remove the illustrative sample entries.
3. Set `ANOMALY_FIXTURE` from the seasonal baseline result, or leave it `null` to keep the "not available" state.
4. Replace `renderIllustrativeBreakdown()` with the real score components when they exist.
5. Connect the Validation screen to real results, and make "Run validation" trigger a backend job.
6. Replace the placeholder `x` and `y` values with projected centroid positions.

## Known limitations of the prototype

- Map positions (`x`, `y`) are placeholder percentages, not geographic coordinates.
- Only 15 March 2026 has map data.
- The Map follows the Calendar's selected date, but only one date has data.
- Mobile touch behaviour, screen-reader use and visual layout have not been tested on real devices.
- The code is one file of about 280 KB. Splitting CSS and JavaScript into separate files is recommended before significant development (see the audit).

## Open decisions

- Whether the Cluster screen should show the first cluster or an empty state when opened directly. Current choice: first high-confidence cluster, labelled.
- Whether illustrative calendar days should be removed before the next review. Recommended: yes.
- Whether to keep the MCD64A1 cross-check in the Validation screen. It is marked optional in the methodology.

## Accessibility

- Keyboard navigation works for screens, calendar days, map dots and the popover.
- Focus returns to the map dot when the popover closes.
- Screen-reader labels exist on interactive elements. These have not been tested with a real screen reader.

## Testing

Run the smoke-test checklist in `docs/SMOKE_TEST.md` before any handover. The checklist was written from the code and has not yet been run in a browser, so the first pass may find mismatches.
