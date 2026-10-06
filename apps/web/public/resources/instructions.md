# FireFusion — Frontend Developer Handoff (Content Lock)

> This file is the content lock for `README.pdf`. All wording, structure, and facts here must be preserved when the PDF is designed — no new claims, metrics, endpoints, or behaviors may be introduced at the design stage. Sourced from `FireFusion_System_Design_v2.pdf`, the 6 PNG exports, the 6 HTML exports, `SCREEN_API_MAPPING.md`, and `IMPLEMENTATION_GUIDE.md`.

---

## 1. FireFusion Overview

FireFusion is a web platform built for NASA Space Apps Challenge 2026, Challenge 9 ("Harmonization of MODIS and VIIRS Hot Spots"), by team VU_Surveyors. It ingests NASA FIRMS MODIS and VIIRS hotspot records for a configured area, produces a harmonised, source-preserving burning-activity record, and presents it through a map, a calendar heatmap, cluster-level evidence, and (planned) validation and seasonal-anomaly views.

The central technical problem is not merging two datasets — it is **harmonising** them without losing their differences. MODIS (1 km resolution) and VIIRS (375 m resolution) see the same fire differently: one burning area can register as a single MODIS detection but 5–7 VIIRS detections. A naive raw count would misread that resolution difference as a sevenfold increase in fire activity. FireFusion's pipeline (Normalise → Cluster → Calibrate → Aggregate → Validate) exists to separate real changes in burning activity from sensor artefacts, while keeping every original detection intact and traceable.

FireFusion is **sensor-aware wildfire intelligence, not wildfire prediction**. It harmonises observations, validates the harmonisation, flags anomalies against historical baselines, and explains its evidence. It never predicts fire spread or danger.

---

## 2. Purpose of the Frontend

The frontend's job is to make the harmonisation pipeline's output legible and trustworthy to a judge, analyst, or end user — not to add new functionality beyond what the backend computes. Concretely, the UI must let someone:

- See where and when fire activity occurred (Map, Calendar).
- Compare raw sensor detections against the harmonised, calibrated result (Raw/Harmonised toggle).
- Drill into any single fire event and see exactly which sensors contributed to it (Cluster Evidence).
- Understand, in plain terms, what the system does and does not claim (Methods & Limitations).
- (Once designed) see the statistical proof that harmonisation improves on raw data (Validation Metrics) and whether current activity is unusual for the place and season (Seasonal Baseline & Anomaly).

Every screen exists to serve one of the five product questions from the System Design: where is fire happening, when, how much of an apparent change is sensor artefact vs. real, are multiple sensors corroborating the same event, and is today unusual for this place and season.

---

## 3. How to Use This Handoff

This handoff consists of four documents, used in this order:

1. **`FireFusion_System_Design_v2.pdf`** — read first. This is the authority on what the system does, what data exists, what each API endpoint returns, and what scientific/interpretation rules apply. If anything in the UI exports contradicts this document, the System Design wins.
2. **PNG exports (6 files)** — the visual reference. These define layout, spacing, typography, color usage, iconography, and exact copy text for each screen.
3. **HTML exports (6 files)** — supporting implementation reference only. They show one way to structure the markup and which design tokens (CSS variables) were used, but they are a design-tool export, not production code, and must not be copied in as-is (see `IMPLEMENTATION_GUIDE.md` Section 2).
4. **`SCREEN_API_MAPPING.md`** and **`IMPLEMENTATION_GUIDE.md`** — working documents that already cross-referenced all of the above screen-by-screen. Use them as the implementation checklist; this README summarizes and organizes the same verified facts for onboarding/reference purposes.

Do not treat the HTML's "NOT SPECIFIED — DO NOT INVENT" labels as something to creatively fill in. They mark a genuine gap between what's been visually designed and what the System Design has defined — see Section 6's placeholder-handling notes and each screen's own "Temporary Placeholder Handling" below.

---

## 4. Source-of-Truth Hierarchy

| Priority | Source | Governs |
|---|---|---|
| 1 (highest) | System Design PDF | Scientific/statistical methods, data schemas, API endpoints and parameters, functional requirements (F1–F12), honesty guardrails |
| 2 | PNG exports | Visual layout, spacing, typography, color, iconography, exact copy wording |
| 3 | HTML exports | Structural/implementation reference only — tokens, class patterns, not a source of new facts or behavior |

Conflict rule: if the HTML implies a feature, metric, or behavior not present in the System Design, it is **not implemented** — flag it, do not build it. If the PNG and HTML disagree visually, the PNG is followed.

---

## 5. How Backend/API Connects to the UI

- The API is entirely **read-only (GET)**. There are no write/mutation endpoints anywhere in this system.
- All ten confirmed endpoints: `GET /calendar`, `GET /cells`, `GET /clusters/{id}`, `GET /clusters/search`, `GET /validation`, `GET /anomaly`, `GET /baseline`, `GET /brief`, `GET /meta`, `GET /health`. No other endpoint should be called from any screen.
- Every response is wrapped in a standard envelope: `{ status, data, error, provenance }`. The `provenance` object (datasets used, parameters, run_id, git_sha) exists on every call and underwrites the system's traceability requirement (F11) — every displayed number must be traceable to a source dataset and processing run.
- Shared filter state (bounding box, date range, mode) should flow from one place in the app so that Map, Calendar, and (eventually) Validation/Anomaly screens stay in sync for the same area and time window, rather than each screen managing its own copy.
- Error handling follows the backend's own contract: 400 for invalid bbox/date, 404 for unknown cluster_id, 503 if the cache is stale. The frontend should surface these conditions, never mask them with invented fallback data.
- The whole system is designed to run **offline-first**: in demo/offline mode (`OFFLINE=1`) the API serves only from pre-cached fixtures, no outbound network calls occur, and the frontend's behavior should be identical whether data comes from live cache or offline fixtures — nothing in the UI should assume a live network connection.

---

## 6. All Six Screens in Detail

### 6.1 Fire Activity Map

**Why this screen exists:** It is the primary geospatial entry point to the product — the place a user first sees where fire activity is located.

**Problem/question it addresses:** "Where is fire activity happening?" and, via the toggle, "How does the raw sensor picture compare to the harmonised one?"

**UI sections and their purpose/data/API:**

| Section | Purpose | Data | API |
|---|---|---|---|
| Header + nav | Move between the six screens | — | — |
| Raw/Harmonised toggle | Switch which data mode the map shows | `mode` param | `GET /cells` |
| Geospatial detections (map canvas) | Render spatial fire activity | Raw: Detection points (lat, lon, sensor_family, conf_class). Harmonised: cell/cluster aggregates (centroid, event_count, corroborated_pct, max_frp, best_conf_class) | `GET /cells` (bbox, date, mode) |
| Evidence standard panel | Explain the raw-vs-harmonised comparison and the confidence-class display rule | — (static) | — |
| Selected-event details | Summarize a clicked map event | Cluster summary for the selected cell | `GET /clusters/{id}` |
| "View cluster evidence" button | Deep-link to full evidence screen | — | — |
| Honesty guardrail footer | Reinforce interpretation rule | — (static) | — |

**What happens after backend integration:** The map canvas renders a live MapLibre GL layer sourced from `/cells` instead of the current placeholder grid; clicking a cell populates "Selected-event details" from `/clusters/{id}`.

**Final populated state:** Map bounded to the configured area of interest (lon 88–93, lat 20–27 per the pilot scope), showing live cells colored/sized by confidence class or event density; clicking any cell reveals its cluster summary and a path to full Cluster Evidence.

**Supported user interactions:** Toggle Raw/Harmonised; click a map cell/cluster to view its details; click "View cluster evidence" to navigate to the Cluster Evidence screen.

**Raw/Harmonised behavior:** Raw = individual sensor detections; Harmonised = clustered fire events (DBSCAN output), shown via mapped confidence classes only, never raw numeric confidence.

**Relevant scientific/interpretation rules:** Hotspots are detections, not fire perimeters. Mapped confidence classes must be shown in harmonised mode, not raw numbers.

**Temporary placeholder handling:** "Map context — bounds, layers, and controls: NOT SPECIFIED" should be resolved using the project's configured area-of-interest file, not invented map controls. "Selected-event details... NOT SPECIFIED" should be resolved by displaying exactly what `/clusters/{id}` returns — no additional fields beyond that schema.

---

### 6.2 Burning Activity Calendar

**Why this screen exists:** This is the core deliverable described in the product vision — a single, trustworthy, time-based "burning activity calendar."

**Problem/question it addresses:** "When is fire activity happening, across the full historical record, and how confident can we be in that record?"

**UI sections and their purpose/data/API:**

| Section | Purpose | Data | API |
|---|---|---|---|
| Intro + Raw/Harmonised toggle | Set the data mode for the calendar | `mode` param | `GET /calendar` |
| Calendar heatmap (year × day grid) | Visualize daily burning activity over time | `data[]` of `{date, count, lo, hi}` | `GET /calendar` (bbox, start, end, mode) |
| Legend (Lower → Higher intensity/count) | Explain the color scale | Derived from the fetched count range | — |
| Interpretation → Uncertainty | State the bootstrap-interval requirement | `lo`/`hi` fields | `GET /calendar` |
| Interpretation → Confidence | Reinforce the mapped-class-only rule | — (static) | — |
| Interpretation → Provenance | State the dataset/run traceability requirement | `provenance` object | `GET /calendar` |
| "Review methods & limitations" link | Cross-navigation | — | — |

**What happens after backend integration:** Calendar cells populate from the real `/calendar` response instead of static color blocks; the legend's intensity scale is computed from the actual returned count distribution rather than fixed.

**Final populated state:** The calendar should span the record defined by the pilot scope (MODIS-only back to the year 2000, full overlap data from 2012 onward), toggled between a raw daily count series and a harmonised series carrying bootstrap uncertainty intervals.

**Supported user interactions:** Toggle Raw/Harmonised; navigate to Methods & Limitations via the review link.

**Raw/Harmonised behavior:** Raw mode shows `raw_event_count` with no interval. Harmonised mode shows `harmonised_event_count` together with `interval_lo`/`interval_hi` (bootstrap uncertainty bands) — this interval display is required specifically for harmonised data.

**Relevant scientific/interpretation rules:** Bootstrap intervals are required for harmonised data. Mapped confidence classes are shown, never raw values. Every displayed number must trace to a source dataset and processing run. Hotspots are detections, not fire perimeters.

**Temporary placeholder handling:** "Temporal aggregation method: NOT SPECIFIED" — daily granularity is confirmed by the backend's daily aggregate table, but the exact calendar cell-binning/visual-aggregation approach is not yet defined; keep this label until that is explicitly specified rather than assuming any particular binning (e.g., weekly or monthly).

---

### 6.3 Cluster Evidence

**Why this screen exists:** It provides event-level transparency — the ability to inspect exactly which sensors contributed to a single fire-event cluster, which is central to the project's evidence-based, non-black-box approach.

**Problem/question it addresses:** "Are multiple sensors corroborating this specific fire event, and can I trace this result back to its source detections?"

**UI sections and their purpose/data/API:**

| Section | Purpose | Data | API |
|---|---|---|---|
| Raw/Harmonised toggle + "Return to map" | Context toggle and back-navigation | — | — |
| Contributing sensors — MODIS contribution | List MODIS detections within this cluster | `/clusters/{id}.members` filtered to MODIS | `GET /clusters/{id}` |
| Contributing sensors — VIIRS contribution | List VIIRS detections within this cluster | `/clusters/{id}.members` filtered to VIIRS | `GET /clusters/{id}` |
| "Source evidence" badge | Mark each contribution as traceable to a source record | `det_id` | `GET /clusters/{id}` |
| Processing lineage (5-stage list) | Document the fixed pipeline this event passed through | Static: Acquisition, Normalisation, Spatio-temporal clustering, Calibration (Poisson GLMs), Aggregation | — |
| Provenance requirement footer | State the traceability rule | dataset ID + processing run ID | implied by `/clusters/{id}` and `/meta` |

**What happens after backend integration:** The MODIS and VIIRS contribution cards populate with real member fields (platform, FRP, confidence class, timestamp) in place of the current "NOT SPECIFIED" text.

**Final populated state:** Each sensor card lists every member detection belonging to that sensor family within the selected cluster, with platform, FRP, confidence class, and timestamp shown per detection; the processing lineage list stays static documentation of the five pipeline stages.

**Supported user interactions:** Toggle Raw/Harmonised (context-dependent, see below); "Return to map" link back to Fire Activity Map.

**Raw/Harmonised behavior:** Not an explicit separate data mode in the backend for this screen — implemented as showing raw member-level detections versus the cluster's harmonised/derived summary values (such as `event_score`), without a second invented data source.

**Relevant scientific/interpretation rules:** Clustering uses DBSCAN with a haversine metric. A cluster is "corroborated" only if both MODIS and VIIRS detected the same event. DBSCAN clusters are derived analytical interpretations — not ground-truth confirmation, burned-area measurement, or incident records. Every displayed number must trace to a dataset ID and processing run.

**Temporary placeholder handling:** "Specific observation fields: NOT SPECIFIED" for both MODIS and VIIRS contributions should be resolved using the member fields already defined in the data schema (platform, FRP, confidence class, timestamp) once wired to the API — this is a wiring gap, not an undefined feature. "Exact identifier format: NOT SPECIFIED" should remain unresolved — the identifier itself is defined as a stable hash, but no display format for it has been specified, so none should be invented.

---

### 6.4 Seasonal Baseline & Anomaly

**Why this screen exists:** To eventually answer whether current fire activity is statistically unusual for a given place and time of year, using a historical day-of-year baseline — this is a documented "Should"-priority feature of the product.

**Problem/question it addresses:** "Is today's activity unusual compared with the historical baseline for this place and season?"

**UI sections and their purpose/data/API:** The screen today is entirely a "Specification Boundary" placeholder — a notice card stating the functionality is not yet specified, a "Required interpretation: NOT SPECIFIED — DO NOT INVENT" box, and navigation (an inert Raw/Harmonised toggle, a "Review methods & limitations" link).

**What happens after backend integration:** Nothing changes automatically — the backend computation and its two endpoints already exist and are fully specified, but no UI layout has been designed to bind them to. Backend readiness does not authorize inventing a chart or interaction for this screen.

**Final populated state (once a UI is designed):** A day-of-year baseline distribution (10th/50th/90th/95th percentiles) for a chosen area, alongside the current date's empirical percentile relative to that distribution, with the baseline's time window and sample size shown for transparency.

**Supported user interactions:** Currently, cross-navigation only ("Review methods & limitations"); the toggle is present but non-functional.

**Raw/Harmonised behavior:** Not defined by the System Design for this screen; leave inert until specified.

**Relevant scientific/interpretation rules:** Anomaly must be expressed only as an empirical percentile relative to the historical baseline; language must say the activity is "unusual for this place and time of year," and must never claim the fire "will spread" or pose "danger." This feature is explicitly the first one dropped if the team runs out of time, which reflects its lower (Should, not Must) priority.

**Temporary placeholder handling:** The current placeholder text is accurate and must be preserved as-is until a real UI design for this screen is produced and separately approved — do not retrofit a chart or metric display onto the existing card.

---

### 6.5 Validation Metrics

**Why this screen exists:** To surface the statistical proof that harmonisation actually improves on the raw sensor data, rather than asking the user to simply trust the Raw/Harmonised toggle.

**Problem/question it addresses:** "How much of the apparent increase in fire detections is sensor artefact, and how do we know the harmonisation actually fixes it?"

**UI sections and their purpose/data/API:** The screen today is entirely a "Specification Boundary" placeholder: a notice card stating validation metrics are not specified, a "Supported" box (bootstrap intervals communicate statistical reliability) and "Not supported" box (validation measures: NOT SPECIFIED — DO NOT INVENT), plus an inert Raw/Harmonised toggle and a "Review methods & limitations" link.

**What happens after backend integration:** As with Seasonal Baseline & Anomaly, the underlying computation and endpoint are fully specified, but the screen's visual design for presenting that data has not been created — backend wiring alone does not unlock new UI content here.

**Final populated state (once a UI is designed):** Display of the overlap-period correlation between raw MODIS and raw VIIRS versus the correlation between their harmonised counterparts (harmonised should read higher), the overlap count ratio before and after harmonisation (harmonised should be closer to 1.0), the result of a step-change test at the sensor handover point (raw should show a significant shift, harmonised should not, or the shift should fall within the uncertainty interval), and the parameter set used to produce these results.

**Supported user interactions:** Currently, cross-navigation only; the toggle is present but non-functional.

**Raw/Harmonised behavior:** Not a per-screen toggle in the traditional sense — the validation data inherently compares raw against harmonised as its entire purpose, rather than the toggle switching between two single series.

**Relevant scientific/interpretation rules:** Bootstrap intervals communicate statistical reliability. This is a Must-priority feature of the product — along with harmonisation itself and the raw/harmonised toggle, it is explicitly protected and must never be cut, even under time pressure.

**Temporary placeholder handling:** The current placeholder text is accurate and must be preserved until a real UI design exists for presenting correlation, ratio, and step-change results — no thresholds, pass/fail indicators, or additional metrics should be invented beyond what the validation computation defines.

---

### 6.6 Methods & Limitations

**Why this screen exists:** To give any viewer — judge, analyst, or user — a transparent account of what the system does, how its pipeline works, and what it explicitly does not claim. This is a required ("Must") feature of the product.

**Problem/question it addresses:** "What exactly is this system doing to the data, and what should I not conclude from it?"

**UI sections and their purpose/data/API:**

| Section | Purpose | Data | API |
|---|---|---|---|
| System design record intro | Explain why MODIS/VIIRS harmonisation is needed and what it does | Static, matches the System Design's problem framing | — |
| Pipeline stages 01–05 | Document the five fixed pipeline stages (Acquisition, Normalisation, Spatio-temporal clustering, Calibration, Aggregation) | Static | — |
| Architecture constraints | State system-level constraints: pre-computed Parquet data queried with DuckDB, FastAPI serving the data layer, offline-first/read-only operation, sub-second response and hackathon-portability targets | Static | — |
| Honesty guardrails | State the interpretation rules that apply system-wide | Static | — |

**What happens after backend integration:** The pipeline-stage descriptions and guardrail text remain static documentation (they describe fixed architecture, not live data); dataset names, date ranges, and licence information could optionally be sourced live from the metadata endpoint instead of being hand-maintained, so this page never drifts out of date if the underlying datasets change.

**Final populated state:** Identical in structure and wording to the current design; the only change integration could bring is sourcing dataset/date-range/licence facts from the live metadata endpoint rather than hardcoding them.

**Supported user interactions:** Header navigation to the other five screens only; this is a reference page, not an interactive one.

**Raw/Harmonised behavior:** Not applicable — there is no toggle on this screen.

**Relevant scientific/interpretation rules (this screen is largely composed of them):** DBSCAN clusters are derived analytical interpretations, not ground-truth confirmation, burned-area/perimeter measurements, or incident records. The Poisson GLM provides calibration and detectability treatment within the harmonisation workflow. Bootstrap resampling can estimate uncertainty intervals for applicable analytical estimates. Mapped confidence classes are shown, never raw numbers. Every displayed number must remain traceable to its source dataset and processing context or run. Methods not named in the design are explicitly out of bounds: "NOT SPECIFIED — DO NOT INVENT."

**Temporary placeholder handling:** The one placeholder on this screen ("Methods not named in the design: NOT SPECIFIED — DO NOT INVENT") is itself a guardrail statement, not a gap to fill — it should remain exactly as written.

---

## 7. UI → System → API Overview

```
            UI LAYER (6 screens)                     SYSTEM LAYER                      API LAYER (read-only)
   ┌─────────────────────────────┐        ┌───────────────────────────┐      ┌───────────────────────────┐
   │ Fire Activity Map            │ ─────▶ │ Cell/Cluster aggregates    │ ──▶  │ GET /cells                 │
   │                               │ ─────▶ │ Cluster evidence           │ ──▶  │ GET /clusters/{id}         │
   ├─────────────────────────────┤        ├───────────────────────────┤      ├───────────────────────────┤
   │ Burning Activity Calendar    │ ─────▶ │ Daily raw/harmonised series│ ──▶  │ GET /calendar              │
   ├─────────────────────────────┤        ├───────────────────────────┤      ├───────────────────────────┤
   │ Cluster Evidence             │ ─────▶ │ Member detections per event│ ──▶  │ GET /clusters/{id}         │
   ├─────────────────────────────┤        ├───────────────────────────┤      ├───────────────────────────┤
   │ Seasonal Baseline & Anomaly  │ ─────▶ │ Day-of-year baseline       │ ──▶  │ GET /baseline              │
   │ (UI not yet designed)        │ ─────▶ │ Anomaly percentile         │ ──▶  │ GET /anomaly               │
   ├─────────────────────────────┤        ├───────────────────────────┤      ├───────────────────────────┤
   │ Validation Metrics           │ ─────▶ │ Overlap correlation/ratio, │ ──▶  │ GET /validation            │
   │ (UI not yet designed)        │        │ step-change test           │      │                            │
   ├─────────────────────────────┤        ├───────────────────────────┤      ├───────────────────────────┤
   │ Methods & Limitations        │ ─────▶ │ Dataset/licence metadata   │ ──▶  │ GET /meta                  │
   └─────────────────────────────┘        └───────────────────────────┘      └───────────────────────────┘
```

Every arrow in this diagram is backed by a System Design section or an explicit API response schema — none are assumed.

---

## 8. How the Six Screens Work Together

- **Fire Activity Map** is the spatial hub: it is linked from every other screen's navigation and is the natural "home" view.
- **Burning Activity Calendar** is the temporal counterpart to the Map — same underlying harmonisation pipeline, viewed by date instead of by location.
- **Cluster Evidence** is a drill-down destination reached from the Map (via "View cluster evidence") and carries a specific cluster_id forward; "Return to map" sends the user back.
- **Methods & Limitations** is the shared reference page — nearly every screen links to it ("Review methods & limitations" / "Methods" nav item), reinforcing that interpretation rules apply system-wide, not per-screen.
- **Validation Metrics** and **Seasonal Baseline & Anomaly** are cross-linked to each other and to Methods; they represent the two "Should"/"Must" features whose backend computation is specified but whose UI is not yet designed.
- The **Raw/Harmonised toggle** appears on five of six screens (all but Methods & Limitations) as the consistent way to express "what the sensors directly recorded" versus "what the harmonisation pipeline concluded," even though only Map and Calendar currently have confirmed, wired behavior for it.
- The **honesty guardrails** (hotspots are detections not perimeters; show mapped confidence classes, not raw numbers; every number traceable to a dataset and run) are restated on Map, Calendar, and Methods, reinforcing them at every point a user might form a conclusion from the data.

---

## 9. Backend Integration Behavior

- All data-bearing panels fetch from the ten confirmed read-only endpoints; no screen fetches from an undocumented endpoint.
- Shared app-level state for bounding box, date range, and mode should drive calls to `/cells`, `/calendar`, and (once built) `/validation`/`/anomaly`/`/baseline`, so all screens reflect the same area/time selection consistently.
- The response envelope `{ status, data, error, provenance }` is unwrapped once, centrally, not re-implemented per screen.
- Errors are surfaced, not hidden: invalid bbox/date (400), unknown cluster (404), and stale cache (503) each need a visible state, matching the system's commitment to transparency rather than silently degrading to fabricated data.
- The system is designed to behave identically whether served from live cache or from offline demo fixtures — no screen should have network-dependent-only behavior that breaks in offline mode.
- Two screens — Validation Metrics and Seasonal Baseline & Anomaly — will not visibly change after backend integration alone, because their blocking gap is UI design, not data availability. Teams should not mistake "the API now works" for "the screen is now ready."

---

## 10. Visual Implementation Rules

- Match each PNG exactly for layout, spacing, typography pairing, color tokens, iconography, and copy wording — the PNG is the final visual authority.
- Do not reorder, merge, or split the sections shown on any screen; the information architecture is fixed by the designs.
- Preserve the color-token semantics already established: a MODIS-specific token for MODIS-related UI, a VIIRS-specific token for VIIRS-related UI, a caution token (defined but not yet used on any current screen — do not repurpose it), and a destructive token reserved for error states.
- Reproduce static, interpretation-bearing copy (honesty guardrails, architecture constraints, pipeline-stage descriptions, Supported/Not-supported statements) verbatim — this text states scientific/system facts, not placeholder prose open to editing.
- Keep "NOT SPECIFIED — DO NOT INVENT" text visually distinct (muted styling) for as long as it remains genuinely unspecified, so it is never confused with confirmed, live data.
- Do not copy the exported HTML files directly into production; extract the shared design tokens once, componentize repeated elements (header/nav, toggle, guardrail footer, Specification Boundary card), and replace prototype-only navigation attributes with real application routing.
- Preserve the existing responsive behavior exactly as encoded in the exports: header and nav stacking, multi-column sections collapsing to single-column below the documented breakpoint, and the consistent minimum tap-target sizing used across every interactive control.

---

## 11. Final Developer Checklist

Before marking any screen complete:

- [ ] Every number or label on the screen traces to a field named in the System Design or a documented API response — nothing invented.
- [ ] Only the ten confirmed endpoints are called anywhere in the application.
- [ ] Validation Metrics and Seasonal Baseline & Anomaly remain Specification Boundary placeholders unless a separately approved UI design exists for them.
- [ ] Honesty guardrail text appears verbatim everywhere the PNG shows it, with no rewording or abbreviation.
- [ ] Raw/Harmonised toggles behave correctly where confirmed (Map, Calendar) and remain inert or context-only where not confirmed (Cluster Evidence, Validation, Seasonal Baseline) — never silently invented.
- [ ] Harmonised views never display raw numeric confidence values, only mapped confidence classes.
- [ ] Every header navigation link matches the PNG's link set and destination exactly, with no extra or missing items.
- [ ] Responsive stacking and column-collapse behavior matches the exported breakpoints on every screen.
- [ ] Loading, empty, and error states exist for every data-driven panel, built from the existing visual language rather than new patterns.
- [ ] The `provenance` object is available (if not always rendered) on every screen displaying derived numbers, preserving traceability.
- [ ] A side-by-side comparison against each PNG shows matching layout, section order, and copy, with any difference explained only by a genuine responsive breakpoint — never by a design change made during implementation.
