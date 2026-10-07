# FireFusion Prototype — Data Contract

This document describes every data shape the prototype reads, where each value
comes from in the intended system, and which parts are still fixtures.

It is written for the developer who will connect the prototype to the backend.
Field names below are exactly the names used in the code.

Status legend:
- **Fixture**: illustrative data loaded from `apps/web/public/data/dummy-data.json`. Replace with backend data.
- **Derived in UI**: computed in the browser from fixture values. Replace with backend values when available.
- **Not implemented**: the UI shows an honest "not available" state. Connect when the backend provides the value.

---

## 1. Cluster event (Map and Cluster Evidence screens)

Runtime value: `clusterData` (array), populated from `/data/dummy-data.json`. Status:
**Fixture**, one date only.

| Field | Type | Meaning | Source in the intended system |
|---|---|---|---|
| `id` | string | Cluster identifier within a date, e.g. `"0192"`. Shown as `CL_<date>_<id>`. | Backend cluster ID (DBSCAN run per local date, System Design §7.2) |
| `x` | number 0–100 | Horizontal position on the map canvas, as a percentage. | **Fixture placeholder.** Must be replaced by projected centroid lon/lat. Not a geographic coordinate. |
| `y` | number 0–100 | Vertical position on the map canvas, as a percentage. | **Fixture placeholder.** Same as `x`. |
| `n_modis` | integer ≥ 0 | Number of MODIS detections in the cluster. | Count of MODIS observations grouped into the cluster |
| `n_viirs` | integer ≥ 0 | Number of VIIRS detections in the cluster. | Count of VIIRS observations grouped into the cluster |
| `corroborated` | boolean | True if both sensor families detected the cluster. | Derived from `n_modis > 0 && n_viirs > 0` in the backend |
| `max_frp` | number (MW) | Maximum fire radiative power among member detections. | FIRMS `frp` field, maximum over members |
| `best_conf_class` | integer 0, 1, 2 | Numeric confidence class: 0 = low, 1 = nominal, 2 = high. | Mapped from FIRMS confidence (System Design §5.3) |
| `conf` | string | Text label: `"Low"`, `"Nominal"` or `"High"`. Must match `best_conf_class`. | Same mapping as `best_conf_class` |
| `event_score` | number 0–1 (optional) | Overall event score. **Not present in the fixture.** | Not yet produced. The UI renders "—" when absent. |

Derived in UI:
- `RAW_OBSERVATION_COUNT` = sum of `n_modis + n_viirs` over all clusters.
- Marker size and colour depend on `n_modis`, `n_viirs`, `corroborated` and `max_frp`.
- Mode "Raw" and "Harmonized" change the marker style only. Harmonized counts are not recomputed in the browser.

### Map date mapping

Runtime value: `MAP_DATA_BY_DATE` (object keyed by ISO date), fetched from
`/data/dummy-data.json`. Status: **Fixture**.

- Only `"2026-03-15"` has entries. Other dates show an empty map with the message
  "No cluster data … in this build."
- Replace with a fetch that returns the cluster list for the selected date.

---

## 2. Calendar daily aggregate

Runtime value: `CALENDAR_FIXTURE` (object keyed by ISO date `"YYYY-MM-DD"`), fetched
from `/data/dummy-data.json`. Status: **Fixture**.

| Field | Type | Meaning | Source |
|---|---|---|---|
| `raw_event_count` | integer | Count of raw detections for the day, before clustering and calibration. | `agg_daily` (System Design §5.4) |
| `harmonized_event_count` | integer | Count of harmonized events for the day. | `agg_daily` |
| `interval_lo` | integer | Lower bound of the uncertainty interval for `harmonized_event_count`. | `agg_daily`, bootstrap (§7.5) |
| `interval_hi` | integer | Upper bound of the uncertainty interval. | `agg_daily`, bootstrap (§7.5) |
| `max_frp` | number (MW) | Maximum FRP on that day. **Stored but not displayed in the calendar.** | `agg_daily` |
| `source` | string | Label shown in the detail panel, e.g. `"cached dataset"`. | Dataset identifier |

All entries, including `2026-03-15`, are labelled **illustrative sample - demo only**.
These values are **not measured**. Remove them before any demonstration that claims
real data.

Year navigation: limited to 2026 (`calYearMin = calYearMax = 2026`).

---

## 3. Anomaly percentile

Constant: `ANOMALY_FIXTURE` = `null`. Status: **Not implemented.**

When non-null, the UI expects:

| Field | Type | Meaning |
|---|---|---|
| `date` | string `"YYYY-MM-DD"` | Date the percentile applies to |
| `observed` | number | Harmonized count for that date |
| `percentile` | number 0–100 | Mid-rank empirical percentile against the day-of-year baseline (§7.4) |

Rule for display: this describes **historical rarity only**. It is not a forecast of
spread or danger. Keep this wording unchanged.

---

## 4. Cluster score components

Status: **Not implemented.** The Cluster screen shows the component layout with an
explicitly labelled "illustrative" breakdown. Those bars are computed from
`max_frp` and `n_modis`/`n_viirs` for layout purposes only. They are **not** the
real score components.

When the backend provides components, replace `renderIllustrativeBreakdown()`
with a render of the real values, and remove the "illustrative" label.

---

## 5. Validation results (Validation screen)

Status: **Not implemented.** Every card displays "Not yet run" or "not available".
The "Run validation" button runs a timed demo only. It computes nothing.

Values the screen will need from the backend (System Design §7.5):

| Value | Shown as |
|---|---|
| Overlap correlation (raw vs raw, harmonized vs harmonized) | Overlap correlation card |
| Overlap ratio (mean daily raw / harmonized) | Overlap ratio card |
| Step-change result at sensor handover | Step-change card |
| `interval_lo`, `interval_hi` (block bootstrap) | Bootstrap table |
| Sensitivity across eps 0.75, 1.0, 1.5, 2.0, 3.0 km | Parameter sensitivity table |
| Test category results (unit, schema, statistical, sensitivity, API, integration, offline) | Test list |

Every displayed validation result must include its configuration (radius, bootstrap
draws, seed, overlap period). The Methods screen describes this requirement.

---

## 6. Provenance

Status: **Partly implemented.** The Methods screen states what provenance should
include. The prototype does not display run IDs or code versions. See the Methods
section "Provenance".

---

## 7. Known gaps (summary)

| Area | State |
|---|---|
| Cluster positions (`x`, `y`) | Placeholder percentages, not geographic |
| Only one map date has data | 2026-03-15 only |
| Calendar sample days | Illustrative, not measured |
| `event_score` | Absent, UI shows "—" |
| Score components | Not implemented, illustrative bars only |
| Anomaly percentile | Not implemented (`ANOMALY_FIXTURE = null`) |
| Validation | Not run, demo button only |
| MCD64A1 cross-check | Not available in this build |
| Calendar ↔ Map | Map follows selected date. Only 15 Mar has data. |
