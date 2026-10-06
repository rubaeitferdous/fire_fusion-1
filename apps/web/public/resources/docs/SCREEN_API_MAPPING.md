# FireFusion — Screen ↔ API Mapping

Source of truth: `FireFusion_System_Design_v2.pdf` (Sections 4–8).
PNG = visual truth. HTML = implementation reference only.
Any "NOT SPECIFIED — DO NOT INVENT" label in the HTML/PNG is a placeholder, not a final spec — it is flagged below with what the System Design does and does not define.

---

## 1. Fire Activity Map

**Purpose:** Primary geospatial entry point — show where fire activity is occurring, as source-preserving raw detections vs. harmonised fire events.
**User goal:** See spatial distribution of detections/clusters on a map, switch between Raw and Harmonised, and drill into a specific event.

**UI sections (PNG):**
- Header + nav (Map / Calendar / Cluster Evidence / Methods)
- Raw/Harmonised toggle
- Geospatial detections panel (map canvas)
- Evidence standard panel (static explanatory text)
- Selected-event details panel
- Honesty guardrail panel (static text)

**Section purposes & data:**
| Section | Purpose | Data required |
|---|---|---|
| Geospatial detections (map) | Render MODIS/VIIRS detections or clusters on MapLibre GL | Raw: `Detection` records (lat, lon, sensor_family, conf_class). Harmonised: `Cluster` records (centroid_lat, centroid_lon, n_modis, n_viirs, corroborated, event_score) |
| Raw/Harmonised toggle | Switch data mode shown on map | mode param passed to `/cells` |
| Evidence standard | Static copy: raw vs harmonised comparison, confidence-class-only display rule | None (static) |
| Selected-event details | Show summary for a clicked cluster/cell | Cluster summary fields (date, counts, confidence class) — exact selected-event fields are NOT SPECIFIED in the System Design beyond what `/clusters/{id}` returns |
| Honesty guardrail | Static reminder: "Hotspots are detections, not fire perimeters" | None (static) |

**Verified System Design requirement:** F5 (calendar/map raw↔harmonised), F3 (clustering), F4 (raw/harmonised series), Section 4.1 (MapLibre GL layer), Section 7 honesty guardrails.
**Verified API endpoint:** `GET /cells` (params: date, bbox, mode) — grid/cell-level event counts for map layer. `GET /clusters/{id}` for event drill-down.
**Relevant data fields:** from `/cells`: centroid_lat, centroid_lon, event_count, corroborated_pct, max_frp, best_conf_class (Section 5.4, agg_cells table). From Detection table: sensor_family, lat, lon, conf_class, frp_mw.
**User interactions:** toggle Raw/Harmonised; click a map cell/cluster → navigate to Cluster Evidence; "View cluster evidence" button.
**Raw/Harmonised behavior:** Raw = individual Detection points by sensor; Harmonised = clustered Fire Events (DBSCAN output), confidence-class display only (not raw numeric confidence), per honesty guardrail (Section 7.5).
**What changes after backend integration:** Map renders live `/cells` response instead of placeholder grid; "Selected-event details" populates from a clicked cell's cluster id via `/clusters/{id}`.
**Temporary placeholder content:** "Map context — Map bounds, layers, and controls: NOT SPECIFIED — DO NOT INVENT" (map viewport/zoom/layer config is not defined in the System Design — must come from `config/aoi.yaml` bbox, not invented); "Selected-event details — Event-selection content and data fields: NOT SPECIFIED — DO NOT INVENT" (exact fields to show on selection beyond cluster schema are undefined).
**Expected final populated state:** Map centered/bounded per `config/aoi.yaml` bbox (lon 88–93, lat 20–27), showing live cells colored by confidence class/event density; clicking a cell shows its cluster_id's basic summary and links to Cluster Evidence.
**Scientific/interpretation rules:** Hotspots = detections, not fire perimeters (Section 7.5 honesty guardrail). Mapped confidence classes must be shown, not raw numeric confidence (applies to harmonised view).

---

## 2. Burning Activity Calendar

**Purpose:** Show the harmonised time-based burning record as a calendar heatmap — this is the core deliverable of the challenge (F5, product vision).
**User goal:** See when burning activity occurred across the record, compare Raw vs Harmonised, understand uncertainty.

**UI sections (PNG):**
- Header + nav
- Intro panel ("Burning activity across the record") + Raw/Harmonised toggle
- Calendar heatmap grid (year × day)
- Interpretation panel (Uncertainty / Confidence / Provenance)
- Honesty guardrail footer

**Section purposes & data:**
| Section | Purpose | Data required |
|---|---|---|
| Calendar heatmap | Year×day visualization of daily counts | `agg_daily` rows: date, raw_event_count or harmonised_event_count, interval_lo, interval_hi |
| Interpretation → Uncertainty | State bootstrap intervals required for harmonised | interval_lo/interval_hi from `/calendar` |
| Interpretation → Confidence | Reinforce mapped-class-only display | None (static rule) |
| Interpretation → Provenance | State dataset/run traceability requirement | provenance object (datasets, run_id, git_sha) |

**Verified System Design requirement:** F5 (calendar heatmap, raw/harmonised toggle), F9 (bootstrap uncertainty bands), F4 (daily series), Section 5.4 (agg_daily table), Section 7.5 (bootstrap intervals).
**Verified API endpoint:** `GET /calendar` (params: bbox, start, end, mode=raw|harmonised).
**Relevant data fields:** date, count, lo, hi (per the documented `/calendar` response schema, Section 6.2); provenance.datasets, provenance.parameters, provenance.run_id.
**User interactions:** Raw/Harmonised toggle; "Review methods & limitations" link.
**Raw/Harmonised behavior:** Raw mode = raw_event_count with no interval; Harmonised mode = harmonised_event_count with interval_lo/interval_hi (bootstrap bands), per F9.
**What changes after backend integration:** Calendar cells populate from real `/calendar` daily data instead of static color blocks; legend intensity scale driven by actual count distribution.
**Temporary placeholder content:** "Temporal aggregation method: NOT SPECIFIED — DO NOT INVENT" — the System Design specifies daily aggregation exists (agg_daily, one row per area/date/mode) but does not define calendar cell-binning/visual-aggregation logic beyond daily granularity, so this stays unspecified until explicitly defined.
**Expected final populated state:** Full date range (per F3.4 pilot scope: MODIS-only back to 2000, overlap period 2012–present) rendered as a heatmap with color intensity = count, toggle switching between raw and harmonised+interval data.
**Scientific/interpretation rules:** Bootstrap intervals required for harmonised data (F9); mapped confidence classes only, not raw values; every displayed number traceable to dataset ID + processing run (provenance, Section 5.5); hotspots are detections not perimeters.

---

## 3. Cluster Evidence

**Purpose:** Event-level inspection — show which sensors (MODIS/VIIRS) contributed to a specific fire event cluster, for transparency/evidence.
**User goal:** Verify corroboration and trace a specific cluster back to its source detections and processing lineage.

**UI sections (PNG):**
- Header + nav + Raw/Harmonised toggle + "Return to map"
- Contributing sensors panel (MODIS contribution, VIIRS contribution)
- Processing lineage panel (5-stage pipeline list)
- Provenance requirement footer

**Section purposes & data:**
| Section | Purpose | Data required |
|---|---|---|
| Contributing sensors | Show MODIS vs VIIRS detections within this cluster | `/clusters/{id}` members array: sensor, platform, frp, conf_class, ts_utc; cluster summary n_modis, n_viirs |
| Processing lineage | Show the 5 fixed pipeline stages | Static (Acquisition → Normalisation → Clustering → Calibration → Aggregation), from Section 4.3 |
| Provenance requirement | State traceability requirement | dataset ID + processing run ID (not a specific format) |

**Verified System Design requirement:** F7 (cluster evidence panel: which sensors, times, FRP, confidence), Section 5.3 (Cluster table: n_modis, n_viirs, corroborated, member detections), Section 7.2 (DBSCAN haversine clustering).
**Verified API endpoint:** `GET /clusters/{id}` — members (det_id, sensor, platform, frp, conf_class, ts_utc), summary (n_modis, n_viirs, max_frp), centroid, corroborated, event_score (Section 6.2 example response).
**Relevant data fields:** cluster_id, local_date, centroid, corroborated, event_score, members[].sensor/platform/frp/conf_class/ts_utc, summary.n_modis/n_viirs/max_frp.
**User interactions:** Raw/Harmonised toggle; "Return to map" link back to Fire Activity Map.
**Raw/Harmonised behavior:** Toggle context is inherited from the Map screen (view the cluster's raw member detections vs. its harmonised/calibrated summary); the System Design does not define a different data source for this toggle on this screen beyond showing member-level raw detections vs cluster-level derived values.
**What changes after backend integration:** "MODIS contribution" / "VIIRS contribution" cards populate real member detection fields instead of "NOT SPECIFIED"; "Source evidence" badge links to actual det_id records.
**Temporary placeholder content:** "Specific observation fields: NOT SPECIFIED — DO NOT INVENT" (×2, MODIS and VIIRS) — the System Design defines the member fields that exist (det_id, sensor, platform, frp, conf_class, ts_utc) in Section 6.2, so these should be populated with those fields, not left unspecified, once wired to `/clusters/{id}`; "Exact identifier format: NOT SPECIFIED — DO NOT INVENT" — det_id is defined as a stable hash (Section 5.2) but no display format is specified.
**Expected final populated state:** Each sensor card lists its member detections (platform, FRP, confidence class, timestamp) pulled from `/clusters/{id}.members`, filtered by sensor_family.
**Scientific/interpretation rules:** DBSCAN with haversine metric (stated correctly in PNG); corroborated = true only if both MODIS and VIIRS detected the event (Section 5.3); every displayed number traceable to dataset ID + processing run (Section 5.5, F11).

---

## 4. Seasonal Baseline & Anomaly

**Purpose:** Per System Design F8/Section 7.4, intended to show whether a date's activity is unusual vs. historical day-of-year baseline for an area.
**User goal:** Understand if current burning activity is anomalous relative to seasonal norms (when implemented).

**UI sections (PNG):** Entirely a "Specification Boundary" placeholder screen — no functional sections yet, only a notice card, a "Required interpretation" box, and navigation (Raw/Harmonised toggle present but inert, "Review methods & limitations" link).

**Verified System Design requirement:** F8 (Should-priority: seasonal baseline and anomaly percentile), Section 7.4 (Stage 4: baseline = day-of-year ±7-day window percentiles p10/p50/p90/p95 across baseline years; anomaly = empirical percentile of observed value, mid-rank for ties).
**Verified API endpoint:** `GET /anomaly` (params: bbox, date) → percentile against day-of-year baseline, baseline window, sample size. `GET /baseline` (params: bbox, doy) → day-of-year percentile distribution (p10, p50, p90, p95).
**Relevant data fields:** percentile, window size, sample_size (from `/anomaly`); p10/p50/p90/p95 (from `/baseline`).
**User interactions:** None functional yet; Raw/Harmonised toggle and "Review methods & limitations" link present but screen has no live content.
**Raw/Harmonised behavior:** Not defined — the System Design does not specify how raw vs. harmonised applies to baseline/anomaly visuals.
**What changes after backend integration:** Once `/anomaly` and `/baseline` are wired, this screen should present: a baseline percentile distribution (p10–p95) and a current anomaly percentile for a chosen date/area, with language constrained to "unusual for this place and time of year" (never "danger"/"will spread").
**Temporary placeholder content:** "Seasonal baseline and anomaly functionality is not specified" — this placeholder is about VISUALIZATION/INTERACTION DESIGN only; the underlying computation (baseline + anomaly) IS specified in Section 7.4 and has defined endpoints. Do not invent chart types, states, or interactions — only the endpoints/fields above are confirmed.
**Expected final populated state:** A baseline distribution display + anomaly percentile reading for the selected date/area, sourced from `/baseline` and `/anomaly`, language-constrained per Section 7.4's "language rule."
**Scientific/interpretation rules:** Anomaly = empirical percentile only ("unusual for this place and time of year"); must never claim fire will "spread" or pose "danger" (Section 7.4 language rule); this is a Should-priority feature (F8) and is first in the cut order if behind schedule (Section 12.4, item 36).

---

## 5. Validation Metrics

**Purpose:** Per System Design F6/Section 7.5, intended to surface the validation evidence (overlap correlation, ratio, step-change) that proves harmonisation improves on raw data.
**User goal:** See evidence that harmonisation works (when implemented), not just trust the toggle.

**UI sections (PNG):** Entirely a "Specification Boundary" placeholder screen — notice card, Supported/Not-supported comparison box, Raw/Harmonised toggle (inert), "Review methods & limitations" link.

**Verified System Design requirement:** F6 (Must-priority: overlap-period validation shown in interface — correlation and ratio, raw vs harmonised), Section 7.5 Validation Framework (overlap correlation, overlap ratio, step-change test, parameter sensitivity, bootstrap intervals, independent cross-check).
**Verified API endpoint:** `GET /validation` (params: bbox) → overlap-period correlations, ratio (raw vs harmonised), step-change test, parameter set (Section 6.1 endpoint table).
**Relevant data fields:** correlation values (raw vs harmonised), ratio, step-change test result/significance, parameter set used (cluster_eps_km, conf_filter, etc., per provenance.parameters pattern).
**User interactions:** None functional yet; Raw/Harmonised toggle and "Review methods & limitations" link present.
**Raw/Harmonised behavior:** Not defined for this screen specifically — the validation data itself inherently compares raw vs harmonised (that is the point of `/validation`), rather than the toggle switching which single series is shown.
<br>
**What changes after backend integration:** Once `/validation` is wired, this screen should present the Section 7.5 validation table: overlap correlation (raw vs harmonised, harmonised should be higher), overlap ratio (harmonised should be closer to 1.0), step-change test result (raw shows shift, harmonised should not), and the parameter set used — NOT invented charts/metrics/thresholds.
**Temporary placeholder content:** "Validation metrics are not specified" — again a VISUALIZATION/INTERACTION placeholder. The System Design explicitly specifies which validation tests exist (Section 7.5 table) and the `/validation` endpoint's return shape (Section 6.1); thresholds/benchmarks for "pass/fail" display are NOT specified and must not be invented.
**Expected final populated state:** Display of overlap correlation (raw vs harmonised), overlap ratio, and step-change test outcome, each tagged with the parameter set used — sourced from `/validation`.
**Scientific/interpretation rules:** Bootstrap intervals communicate statistical reliability (F9, stated in placeholder copy — correct per Section 7.5); traceability via provenance metadata required (F11); this is a Must-priority feature (F6) — cannot be cut per Section 12.4 ("NEVER drop: harmonisation, validation, or the raw/harmonised toggle").

---

## 6. Methods & Limitations

**Purpose:** System design record / transparency page explaining the harmonisation pipeline, architecture constraints, and honesty guardrails (F11 — Must).
**User goal:** Understand what the system does, does not do, and does not claim.

**UI sections (PNG):**
- Header + nav
- System design record intro (deterministic harmonisation pipeline summary)
- Pipeline stages (01–05)
- Architecture constraints
- Honesty guardrails

**Section purposes & data:**
| Section | Purpose | Data required |
|---|---|---|
| System design record | State MODIS/VIIRS harmonisation rationale | Static text, matches Section 2.1/2.3 |
| Pipeline stages 01–05 | Document the 5 fixed stages | Static, matches Section 4.3 data flow pipeline |
| Architecture constraints | State storage/serving/performance constraints | Static, matches Section 4.1/3.3 (Parquet+DuckDB, FastAPI, offline-first, sub-second target) |
| Honesty guardrails | State interpretation rules | Static, matches Section 7.5 "RULE" box |

**Verified System Design requirement:** F11 (Must: methods and limitations page), Section 4.3 (5-stage pipeline: Acquire→Normalise→Cluster→Calibrate→Aggregate), Section 3.3 (non-functional requirements: offline-first, reproducible, transparent, fast), Section 7.5 (honesty guardrails).
**Verified API endpoint:** `GET /meta` — datasets, product names, date ranges, limitations, licence (feeds this panel, per Section 6.1).
**Relevant data fields:** datasets[], parameters, limitations text, licence — from `/meta`.
**User interactions:** Nav links only (Map/Calendar/Evidence); this is a static/reference screen.
**Raw/Harmonised behavior:** Not applicable — no toggle on this screen.
**What changes after backend integration:** Content currently hardcoded in HTML should be sourced from `/meta` (dataset names, date ranges, licence) so it stays accurate if datasets/parameters change; pipeline-stage and guardrail text can remain static documentation since it describes fixed architecture, not live data.
**Temporary placeholder content:** "Methods not named in the design: NOT SPECIFIED — DO NOT INVENT" — correctly scoped; nothing on this screen currently contradicts the System Design. No fabricated methods should be added beyond the five stages and listed guardrails.
**Expected final populated state:** Same structure as current PNG/HTML, with dataset/date-range/licence details pulled live from `/meta` rather than hardcoded, keeping pipeline description and guardrails as fixed documentation.
**Scientific/interpretation rules:** DBSCAN clusters are derived analytical interpretations, not ground-truth/burned-area/perimeter/incident records (Section 2.3, 5.3); Poisson GLM provides calibration/detectability treatment (Section 7.3); hotspots are detections not perimeters; bootstrap resampling estimates uncertainty for applicable estimates; mapped confidence classes shown, not raw numbers; every displayed number traceable to source dataset + processing run (Section 5.5).

---

## Cross-Screen Notes

- **Navigation model:** All screens link to each other via `data-uxm-link` (Map, Calendar, Cluster Evidence, Methods); Validation and Seasonal Baseline additionally link to each other and to Methods. This matches a flat nav, not a strict linear flow.
- **Global Raw/Harmonised toggle:** Present on Map, Calendar, Cluster Evidence, Validation, and Seasonal Baseline screens. Functional meaning is confirmed only for Map (`/cells` mode param) and Calendar (`/calendar` mode param). For Cluster Evidence, Validation, and Seasonal Baseline, the System Design does not define toggle-specific data switching — do not invent behavior beyond what `/validation`, `/anomaly`, `/baseline`, and `/clusters/{id}` already return.
- **Universal honesty guardrails** (Section 7.5, repeated across screens): hotspots = detections not perimeters; mapped confidence classes only, not raw numbers; every displayed number traceable to dataset ID + processing run.
- **Two screens (Validation Metrics, Seasonal Baseline & Anomaly) are UI-placeholder-only today** despite having fully specified backend computations and endpoints in the System Design (Sections 7.4, 7.5, 6.1). The "NOT SPECIFIED" text refers to visualization/interaction design, not to whether the feature or its API exists.
- **Endpoints confirmed by System Design:** `/calendar`, `/cells`, `/clusters/{id}`, `/clusters/search`, `/validation`, `/anomaly`, `/baseline`, `/brief`, `/meta`, `/health`. No endpoint outside this list should be invented for any screen.
