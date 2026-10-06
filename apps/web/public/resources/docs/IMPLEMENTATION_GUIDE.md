# FireFusion — Implementation Guide

This guide explains how to implement the six existing UI screens as designed — not how to redesign them. It assumes `SCREEN_API_MAPPING.md` and `FireFusion_System_Design_v2.pdf` have already been read.

---

## 1. Source-of-Truth Rules

| Source | Role | Use for |
|---|---|---|
| `FireFusion_System_Design_v2.pdf` | **Technical/scientific truth** | API endpoints, data fields, pipeline stages, validation methods, calibration logic, honesty guardrails, what is Must/Should/Could (F1–F12) |
| PNG exports | **Visual truth** | Layout, spacing, component shapes, typography, color usage, exact copy wording |
| HTML exports | **Supporting reference only** | Class names, structure patterns, token names (`--primary`, `--modis`, etc.) — a starting point, not the deliverable |

Rules that follow from this:
- If the HTML and PNG ever disagree, the **PNG wins** for appearance.
- If the HTML/PNG show a label or number and the System Design doesn't define it, treat it as **undefined**, not as permission to invent it.
- The exported HTML is a design-tool export (Tailwind v4 `@theme inline`, iconify-icon, Chart.js via CDN, `data-uxm-link` attributes for prototype navigation). It is **not production code** — see Section 2.
- Never upgrade a "NOT SPECIFIED — DO NOT INVENT" placeholder using guesswork. Only replace it once the System Design or a real API response defines the value (see Section 7).

---

## 2. Frontend Implementation Approach

**Do not copy-paste the exported HTML files into the production app.** Treat each exported `.html` file as a structural/styling reference and rebuild it properly:

1. **Extract the design system once**, not per-screen: the `:root` CSS variables (`--background`, `--primary`, `--modis`, `--viirs`, `--caution`, etc.), font stack (Inter / Space Grotesk / JetBrains Mono), radius, and shadow tokens are identical across all six exports. Centralize these in one theme file.
2. **Replace prototype-only mechanics:**
   - `data-uxm-link` / `data-uxm-link-frame` attributes are design-tool navigation hooks — replace with real router links (screen names map 1:1: Map, Calendar, Cluster Evidence, Methods, Validation, Seasonal Baseline).
   - Drop the CDN-loaded Tailwind-via-`<script>` and Chart.js CDN tags from the exports; use the project's actual build pipeline and chosen charting library (MapLibre GL per Section 9 tech stack; the System Design does not mandate Chart.js).
   - `iconify-icon` web-component tags can stay if the project already uses Iconify, or be swapped for the project's existing icon set — the PNG only commits you to which icon concept appears (database, layers, monitor, zap, map-pin, calendar, info, etc.), not the exact library.
3. **Componentize shared pieces** that repeat across screens: header/nav bar, Raw/Harmonised toggle, honesty-guardrail footer/panel, "Specification Boundary" placeholder card (used identically on Validation Metrics and Seasonal Baseline & Anomaly).
4. **Keep static copy verbatim** where it states a scientific/interpretation rule (e.g., "Hotspots are detections, not fire perimeters") — this is System-Design-sourced language (Section 7.5), not filler text, and must not be reworded.

---

## 3. Screen-by-Screen Implementation

For each screen: **UI section → purpose → backend data → API → final connected behavior.**

### 3.1 Fire Activity Map

| UI Section | Purpose | Backend data | API | Final connected behavior |
|---|---|---|---|---|
| Header + nav | Wayfinding across the 6 screens | — | — | Static nav; highlight current screen |
| Raw/Harmonised toggle | Switch map data mode | `mode` query param | `GET /cells` | Toggling re-fetches `/cells?mode=raw` or `mode=harmonised`; re-renders map layer |
| Geospatial detections (map canvas) | Show spatial fire activity | Raw: Detection points (lat, lon, sensor_family, conf_class). Harmonised: Cluster/cell aggregates (centroid, event_count, corroborated_pct, max_frp, best_conf_class) | `GET /cells` (params: date, bbox, mode) | Render MapLibre GL layer from `/cells` response; color/size by `best_conf_class` or `event_count`, never raw numeric confidence in harmonised mode |
| Evidence standard panel | Explain raw-vs-harmonised comparison and confidence-class rule | — | — | Static text, unchanged by integration |
| Selected-event details | Show summary after clicking a cell | Cluster summary via click target's cluster_id | `GET /clusters/{id}` | On cell click, fetch cluster by id, display what the schema provides (n_modis, n_viirs, max_frp, corroborated, event_score); do not invent additional displayed fields |
| "View cluster evidence" button | Navigate to full evidence screen | — | — | Routes to Cluster Evidence screen with the selected cluster_id |
| Honesty guardrail footer | Reinforce interpretation rule | — | — | Static, verbatim text |

### 3.2 Burning Activity Calendar

| UI Section | Purpose | Backend data | API | Final connected behavior |
|---|---|---|---|---|
| Intro + Raw/Harmonised toggle | Set mode for calendar | `mode` query param | `GET /calendar` | Toggling re-fetches with `mode=raw` or `mode=harmonised` |
| Calendar heatmap (year × day grid) | Visualize daily burning activity over time | `/calendar` response: `data[]` of `{date, count, lo, hi}` | `GET /calendar` (bbox, start, end, mode) | Each cell colored by `count`; harmonised mode cells carry `lo`/`hi` for uncertainty display (e.g., tooltip) |
| Legend ("Lower" → "Higher relative burning activity intensity / count") | Explain color scale | derived from count distribution | — | Scale bounds computed from the fetched data range, not hardcoded |
| Interpretation → Uncertainty | State bootstrap-interval requirement | `lo`/`hi` fields | `GET /calendar` | Only shown/non-empty in Harmonised mode (bootstrap intervals apply to harmonised series per F9) |
| Interpretation → Confidence | Reinforce mapped-class-only rule | — | — | Static |
| Interpretation → Provenance | State traceability requirement | `provenance` object | `GET /calendar` | Can surface `provenance.datasets` / `run_id` if a provenance display is added — System Design requires traceability (F11) but doesn't mandate showing the raw JSON on this screen |
| "Review methods & limitations" link | Cross-navigation | — | — | Routes to Methods & Limitations |

### 3.3 Cluster Evidence

| UI Section | Purpose | Backend data | API | Final connected behavior |
|---|---|---|---|---|
| Raw/Harmonised toggle + "Return to map" | Context toggle / back-nav | — | — | Return-to-map routes back to Fire Activity Map; toggle behavior on this screen is not defined beyond showing member detections (raw) vs. cluster-level derived summary (harmonised) — do not invent a different data source |
| Contributing sensors — MODIS contribution | List MODIS member detections in this cluster | `/clusters/{id}.members` filtered where `sensor == "MODIS"` | `GET /clusters/{id}` | Populate with each member's `platform`, `frp`, `conf_class`, `ts_utc`, `det_id` |
| Contributing sensors — VIIRS contribution | List VIIRS member detections | `/clusters/{id}.members` filtered where `sensor == "VIIRS"` | `GET /clusters/{id}` | Same fields as above, VIIRS members |
| "Source evidence" badge | Mark each card as traceable | `det_id` | `GET /clusters/{id}` | Can link/expand to the underlying detection record(s) |
| Processing lineage (5-stage list) | Document the fixed pipeline | Static (Section 4.3) | — | Static; do not make dynamic — the 5 stages are architecture, not live data |
| Provenance requirement footer | State traceability rule | dataset ID + run ID | implied by `/clusters/{id}` + `/meta` | Static rule text; exact identifier format remains "NOT SPECIFIED" per System Design — do not invent a display format |

### 3.4 Seasonal Baseline & Anomaly

| UI Section | Purpose | Backend data | API | Final connected behavior |
|---|---|---|---|---|
| Specification Boundary notice | Signal this screen is not yet designed/built | — | — | **Keep as-is until a UI design is actually specified.** The backend computation exists (Section 7.4) but the screen's layout, chart type, and interactions are genuinely undefined — do not design or invent a chart here |
| Raw/Harmonised toggle (inert) | Placeholder control | — | — | Leave non-functional until the screen is actually designed |
| "Review methods & limitations" link | Cross-navigation | — | — | Functional now (standard nav link) |
| *(Future, once designed)* | Show day-of-year baseline (p10/p50/p90/p95) and anomaly percentile for a chosen date/area | baseline distribution + anomaly percentile | `GET /baseline` (bbox, doy), `GET /anomaly` (bbox, date) | When this screen is eventually designed, implement against these two endpoints only; language must follow the Section 7.4 rule: "unusual for this place and time of year," never "danger"/"will spread" |

### 3.5 Validation Metrics

| UI Section | Purpose | Backend data | API | Final connected behavior |
|---|---|---|---|---|
| Specification Boundary notice | Signal this screen is not yet designed/built | — | — | Keep as-is; the validation computation is fully specified (Section 7.5) but its chart/threshold/benchmark presentation is not — do not invent thresholds or pass/fail visuals |
| Supported / Not-supported boxes | State what is and isn't defined | — | — | Keep verbatim; "Bootstrap intervals communicate statistical reliability" is correct per F9/Section 7.5 |
| Raw/Harmonised toggle (inert) | Placeholder control | — | — | Leave non-functional until screen is designed |
| "Review methods & limitations" link | Cross-navigation | — | — | Functional now |
| *(Future, once designed)* | Show overlap correlation (raw vs harmonised), overlap ratio, step-change test result, parameter set | validation metrics | `GET /validation` (bbox) | Must-priority feature (F6) — when designed, must surface correlation, ratio, and step-change outcome; do not invent additional metrics, benchmarks, or pass/fail thresholds beyond what `/validation` returns |

### 3.6 Methods & Limitations

| UI Section | Purpose | Backend data | API | Final connected behavior |
|---|---|---|---|---|
| System design record intro | Explain harmonisation rationale | Static (Section 2.1/2.3) | — | Static text, verbatim |
| Pipeline stages 01–05 | Document fixed pipeline | Static (Section 4.3) | — | Static; do not make dynamic |
| Architecture constraints | State system constraints (Parquet+DuckDB, FastAPI, offline-first, sub-second) | Static (Section 3.3/4.1) | — | Static; could optionally pull live values (e.g., actual response time) but System Design doesn't require this |
| Honesty guardrails | State interpretation rules | Static (Section 7.5) | — | Static, verbatim — never edit wording |
| *(Optional enhancement)* | Keep dataset names/date ranges/licence accurate if they ever change | dataset metadata | `GET /meta` | If hardcoded dataset names drift from reality, source them from `/meta` instead of hand-editing HTML each time |

---

## 4. API/Data Integration

- Base integration pattern: each screen's dynamic panel calls its documented endpoint with the documented params (see Section 3 tables and `SCREEN_API_MAPPING.md`). No screen should call an endpoint not in this confirmed list: `/calendar`, `/cells`, `/clusters/{id}`, `/clusters/search`, `/validation`, `/anomaly`, `/baseline`, `/brief`, `/meta`, `/health`.
- All responses are wrapped `{ status, data, error, provenance }` per Section 6.3 — unwrap consistently in one data-fetching layer, not per-screen.
- Respect the response envelope's `provenance` object wherever a screen claims traceability (per F11); it is optional to *display* but the object must exist on every data call.
- API is **read-only (GET only)** — never build write/mutation calls for any screen (Section 6.1).
- `bbox`/`start`/`end`/`date`/`mode` params should come from a shared app-level filter/area-selection state, not be hardcoded per screen, so Map/Calendar/Validation/Anomaly all stay in sync for the same area and date range.

---

## 5. Raw vs. Harmonised Behavior

Confirmed by the System Design:

| Screen | Raw means | Harmonised means | Confirmed? |
|---|---|---|---|
| Fire Activity Map | Individual Detection points by sensor | Clustered Fire Events (cell aggregates) | Yes — `/cells?mode=` |
| Burning Activity Calendar | `raw_event_count`, no interval | `harmonised_event_count` with `interval_lo`/`interval_hi` | Yes — `/calendar?mode=` |
| Cluster Evidence | Member-level raw detections | Cluster-level derived summary | Implied only — not an explicit mode param in the System Design; implement as showing members (raw) vs. summary stats (harmonised) without inventing a second data source |
| Validation Metrics | — | — | Not applicable as a toggle; `/validation` itself compares raw vs. harmonised internally |
| Seasonal Baseline & Anomaly | — | — | Not defined; leave inert |
| Methods & Limitations | — | — | No toggle present |

General rule: **never show raw numeric confidence values in Harmonised mode** — only mapped confidence classes (low/nominal/high), per the honesty guardrail repeated on Map, Calendar, and Methods screens.

---

## 6. Loading / Empty / Error States

The System Design does not specify exact loading/empty/error UI (this falls under "NOT SPECIFIED" territory for visual states), so implement these using the **existing visual language already present in the designs**, not new patterns:

- **Loading:** Reuse the existing card/panel shapes (`bg-card`, `border-border`, `rounded-xl`) with a neutral skeleton or spinner inside — do not introduce a new visual style.
- **Empty (no data for bbox/date range):** Reuse the "Specification Boundary" card pattern already used on Validation Metrics and Seasonal Baseline (icon + heading + explanatory paragraph), but with copy describing "no data for this selection," not a methods-boundary message — these are different meanings and must not be conflated in wording.
- **Error (API failure, per Section 6.3: 400/404/503):**
  - 400 (invalid bbox/date) → inline validation message near the filter control that produced it.
  - 404 (unknown cluster_id) → on Cluster Evidence, show a not-found state and a link back to the Map.
  - 503 (stale cache) → surface a "data may be outdated" notice; this directly supports the offline-first/transparency requirements (Section 3.3) rather than hiding the condition.
- Never silently fall back to invented placeholder numbers on error — show the error state instead.

---

## 7. Placeholder → Real-Data Behavior

Rule: a "NOT SPECIFIED — DO NOT INVENT" label is replaced **only** when a concrete, System-Design-backed value exists to replace it with. Two distinct placeholder categories exist — handle them differently:

**Category A — Fields are specified, only the wiring is missing** (replace once integrated):
- Cluster Evidence → "Specific observation fields: NOT SPECIFIED" → replace with the actual member fields from `/clusters/{id}` (platform, frp, conf_class, ts_utc) once that endpoint is wired. This is not an invention; the schema already defines these fields.
- Fire Activity Map → "Selected-event details... NOT SPECIFIED" → populate with whatever `/clusters/{id}` returns for the selected cell; do not add fields beyond that response.

**Category B — The screen's design itself is not yet specified** (do not force real data into them):
- Validation Metrics and Seasonal Baseline & Anomaly placeholders describe an *undesigned UI*, not missing wiring. Their backend/API is specified (Sections 7.4, 7.5), but no layout exists to bind data to. Do not retrofit charts or metrics onto the current placeholder card — that would be redesigning, which is explicitly out of scope. Leave these screens as Specification Boundary cards until an actual UI design for them is produced and approved separately.
- Map "Map context... NOT SPECIFIED" (bounds/layers/controls) → use `config/aoi.yaml` bbox as the only defined input; do not invent additional map layers, controls, or zoom presets beyond what's configured.
- Calendar "Temporal aggregation method: NOT SPECIFIED" → the System Design confirms daily granularity (agg_daily) but not calendar-cell binning logic; keep the placeholder label until this is explicitly defined, do not assume weekly/monthly binning.
- Cluster Evidence "Exact identifier format: NOT SPECIFIED" → det_id exists as a stable hash (Section 5.2) but no display formatting is defined; show the raw id or omit display formatting decisions, don't invent a human-readable format.

---

## 8. Navigation / Interactions

- Six screens, flat navigation (not strictly linear): Map, Calendar, Cluster Evidence, Methods are cross-linked from nearly every screen's header nav; Validation and Seasonal Baseline link to each other and to Methods, and are reachable via "Review methods & limitations" from several screens.
- Replace prototype `data-uxm-link-frame` IDs with real route identifiers; keep the link labels and target screens exactly as shown in the PNGs (e.g., "Map", "Calendar", "Evidence"/"Cluster evidence", "Methods", "Validation", "Review methods & limitations").
- "Return to map" (Cluster Evidence) and "View cluster evidence" (Fire Activity Map) are the only two inter-screen interactions carrying state (a cluster_id) — ensure this id is passed through routing, not re-derived.
- Raw/Harmonised toggles are per-screen UI state, not global; switching mode on one screen does not need to carry over to another screen's toggle unless a shared "mode" is added to global filter state later (not currently specified).

---

## 9. Responsive Implementation

The HTML exports already encode the intended responsive behavior via Tailwind breakpoints — preserve this, don't redesign it:
- Header: `flex-col` stacking on mobile, `md:flex-row` with space-between on larger screens.
- Nav buttons: `flex-wrap` on narrow viewports, `md:flex-nowrap` on wider ones.
- Two-column sections (`lg:grid-cols-2`, `lg:grid-cols-3`, `lg:grid-cols-4`) collapse to single-column (`grid-cols-1`) below the `lg` breakpoint — keep this collapse behavior.
- Raw/Harmonised toggle + action buttons: `flex-col` stacking with `sm:flex-row` on the Validation/Seasonal screens — preserve the same stacking thresholds.
- Minimum tap target height `min-h-11` (44px) is used consistently on every interactive button/toggle across all six screens — keep this for accessibility, don't shrink it on mobile.
- Do not introduce new breakpoints or alter the column counts already shown in the PNGs/HTML; match them as implemented, including on the map screen's `lg:col-span-3` / sidebar `lg:col-span-1` split.

---

## 10. Visual Fidelity Rules

- Match the PNG exactly for: layout structure, spacing, typography pairing (Space Grotesk headings / Inter body / JetBrains Mono for monospace needs), color tokens, icon choice, and copy text.
- Preserve the exact color-token semantics already defined: `--modis`/`--modis-soft` for MODIS-related UI, `--viirs`/`--viirs-soft` for VIIRS-related UI, `--caution`/`--caution-soft` reserved (not yet used in current screens, but defined — don't repurpose), `--destructive`/`--destructive-soft` for error states.
- Do not change which sections appear on which screen, reorder sections, or merge/split cards — the PNG defines the final information architecture.
- Static/explanatory copy (honesty guardrails, architecture constraints, pipeline stage descriptions, "Supported"/"Not supported" text) must be reproduced verbatim — these are System-Design-derived statements, not placeholder prose to be rewritten.
- "NOT SPECIFIED — DO NOT INVENT" text should visually remain distinguishable (e.g., muted-foreground styling, as already used) for as long as it remains a true placeholder — don't restyle it to look like confirmed data before it is.

---

## 11. Final QA Requirements

Before considering any screen "done," verify:

1. **No invented data:** every number/label traces to a field explicitly named in `SCREEN_API_MAPPING.md` or the System Design — spot-check against Section 6.2 example responses.
2. **No invented endpoints:** confirm only the 10 documented endpoints (`/calendar`, `/cells`, `/clusters/{id}`, `/clusters/search`, `/validation`, `/anomaly`, `/baseline`, `/brief`, `/meta`, `/health`) are called anywhere in the app.
3. **Placeholder integrity:** Category B placeholders (Validation Metrics, Seasonal Baseline & Anomaly) remain as Specification Boundary cards unless a new, separately-approved UI design exists for them.
4. **Honesty guardrail text** appears verbatim wherever the PNG shows it (Map, Calendar, Methods) and is not abbreviated or reworded.
5. **Raw/Harmonised toggles** only trigger real mode-switching where confirmed (Map, Calendar); toggles on Cluster Evidence, Validation, Seasonal Baseline either behave per Section 5's documented interpretation or remain inert, never silently fetching invented data.
6. **Confidence display rule:** harmonised views never display raw numeric confidence — only mapped classes.
7. **Navigation parity:** every header nav link on every screen matches the PNG's link set and target screen exactly; no extra or missing nav items.
8. **Responsive behavior:** breakpoints and stacking match Section 9 for every screen, tested at the same widths the Tailwind classes imply (mobile, `md`, `lg`).
9. **Error/loading/empty states** exist for every data-driven panel (Section 6) and use the existing visual language, not new components.
10. **Provenance availability:** every screen that displays derived numbers (Calendar, Cluster Evidence, Validation when built) has access to the response's `provenance` object, even if not always rendered, so traceability (F11) is never structurally broken.
11. **No redesign drift:** a side-by-side visual diff against each PNG shows matching layout, section order, and copy — any visual difference must be justified by a real responsive breakpoint, not a design decision made during implementation.
