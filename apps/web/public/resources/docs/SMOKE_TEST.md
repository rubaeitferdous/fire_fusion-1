# FireFusion Prototype — Smoke-Test Checklist

Use this checklist after any change to `FireFusion_Prototype_v14.html`, and before
handing a build to anyone. It checks that every screen opens and every interactive
control responds. It does **not** check scientific correctness. For that, see the
data contract and the Methods screen.

**How to use:** open the file in a browser, go through each section in order, and
mark each item pass or fail. Record the browser and device used at the top of your
test log. Stop at the first failure in a section and record it before continuing.

**Recommended browsers:** latest Chrome, Firefox and Safari. Test on one phone
(iOS or Android) and one desktop.


> **Note:** This checklist was written from the code, not from a browser run. Every
> item describes behaviour the code is meant to produce. The first real test pass
> may find items that do not match. Record those as failures and fix the code or
> the checklist, whichever is wrong.

---

## 0. Load

- [ ] File opens with no blank screen.
- [ ] Browser console shows no red errors on load.
- [ ] Page renders with the Inter and Space Grotesk fonts (headings look like Space Grotesk, body text like Inter). Works with the network turned off.
- [ ] Overview is the first screen shown.

## 1. Navigation

- [ ] Each top-nav button opens its screen: Overview, Map, Calendar, Cluster, Validation, Methods.
- [ ] The active nav button is highlighted and has `aria-current="page"`.
- [ ] Keys `1`–`6` switch to the matching screen. Keys do nothing while typing in an input.
- [ ] On a narrow screen, the menu button opens the sheet. Choosing an item closes it. `Escape` closes it.
- [ ] Each screen starts scrolled to the top when opened.

## 2. Overview

- [ ] The "Open the map" button opens Map.
- [ ] "See the evidence →" opens Validation.
- [ ] "Full methodology →" opens Methods.
- [ ] "Offline cache" chip shows its explanation on hover and on keyboard focus.
- [ ] The "Derived results" card expands on click, and on Enter or Space. Clicking again collapses it.
- [ ] The "Raw vs. harmonized" area shows the "Not available in the cached dataset" note.
- [ ] "View cache log" expands and collapses. Its button text changes between "View" and "Hide", and `aria-expanded` changes too.

## 3. Map

- [ ] Map subtitle shows "15 Mar 2026".
- [ ] Map shows fire markers for 15 Mar 2026.
- [ ] "Raw" and "Harmonized" toggles switch the marker style. The selected toggle has `aria-selected="true"`.
- [ ] Each confidence filter (High, Nominal, Low) hides and shows its markers. At least one filter stays on.
- [ ] Zoom `+`, `−` and reset (⟲) change the map zoom. Reset returns to the starting view.
- [ ] Dragging the map pans it on a touch screen without scrolling the page sideways.
- [ ] Clicking a marker opens the popover with its ID (`CL_2026-03-15_…`), source, FRP, and confidence.
- [ ] Pressing Enter or Space on a focused marker opens the popover.
- [ ] Focus moves into the popover when it opens.
- [ ] Clicking the ✕ button, or clicking an empty part of the map, closes the popover.
- [ ] After closing the popover with the keyboard, focus returns to the same marker.
- [ ] "Open evidence panel" in the popover opens the Cluster screen for that cluster.
- [ ] Hovering a marker shows a small tooltip. It hides when the pointer leaves.

## 4. Calendar

- [ ] The current year (2026) is shown. The previous-year button is disabled. The next-year button is disabled.
- [ ] Month labels run Jan–Dec in order.
- [ ] Day cells for dates with sample data look highlighted. Others are dimmed.
- [ ] Clicking 15 Mar 2026 shows its counts in the detail panel: harmonized count with interval, raw count.
- [ ] Clicking another day with data (for example 8 Jan 2026) updates the detail panel.
- [ ] Clicking a day with no data shows "Not available" in the detail panel.
- [ ] Only one day cell has `aria-pressed="true"` at a time. Clicking another day moves it.
- [ ] Enter and Space on a focused day cell select it.
- [ ] Every selected day updates the Map subtitle and note.
- [ ] Selecting a day with no cluster data shows the empty-map message ("No cluster data … in this build").
- [ ] The anomaly section shows "Not available" and the historical-rarity wording.

## 5. Cluster evidence

- [ ] Opened from Map, it shows the cluster selected on Map.
- [ ] Opened directly from the nav bar (without a Map click), it shows a cluster instead of "No cluster selected". The first one should be a high-confidence cluster.
- [ ] Heading reads "Corroborated fire event" or "Single-sensor fire event", matching the data.
- [ ] Fields table shows the cluster ID, MODIS and VIIRS counts, and max FRP. Fields with no data show "not available".
- [ ] Score ring shows "—" with no fill (no real event score exists).
- [ ] "Score composition" shows the note about unavailable values, followed by a block labelled "Illustrative sample · not real data".
- [ ] "Back to map" returns to Map.

## 6. Validation

- [ ] Every card shows "Not yet run" or "—". No card shows a number.
- [ ] "Run validation" button: click it. The button text changes to "Running…" and the button is disabled.
- [ ] After about 1.5 seconds the button returns to "Run validation".
- [ ] The note under the header says the run is a demo and computes nothing, both during and after the run.
- [ ] Cannot click "Run validation" again while it is running.
- [ ] Parameter sensitivity table lists eps 0.75, 1.0, 1.5 (default), 2.0 and 3.0 km, each "not run".
- [ ] Unit-test list shows "— not run" for each test category.

## 7. Methods

- [ ] The table-of-contents chips are shown in a horizontal row.
- [ ] Clicking a chip scrolls **only the Methods content**. The page does not jump or move sideways.
- [ ] The chip matching the section in view is highlighted as you scroll.
- [ ] The active chip stays visible inside the chip row when scrolling.
- [ ] All 10 sections render: overview, harmonization, sources, MODIS vs VIIRS, workflow, validation, provenance, limitations, non-goals, LLM boundary.
- [ ] Scrolling inside Methods does not scroll the screen behind it.

## 8. Responsive and touch

- [ ] Test on a phone in portrait. No element is cut off on the right.
- [ ] Tables and the chip row scroll inside themselves, not the whole page.
- [ ] Map drag works without fighting page scroll.
- [ ] Popover stays inside the screen on a narrow phone.
- [ ] Text remains readable at default browser zoom.

## 9. Accessibility (quick pass)

- [ ] Tab moves through every nav button, card action, day cell, marker, and popover button in a sensible order.
- [ ] Focus outline is visible on every focused control.
- [ ] Map popover is announced as a dialog by a screen reader (NVDA, VoiceOver or TalkBack).
- [ ] Calendar day cells are announced with their date and status.

## 10. Final checks before handover

- [ ] No external URLs in the file (`grep -o 'https\?://' FireFusion_Prototype_v14.html` returns only the intended ones).
- [ ] No text reads "Created by [Your name]" or other unfilled placeholders.
- [ ] Illustrative calendar days have been reviewed. Remove them if the build will be shown as real data.
- [ ] `docs/DATA_CONTRACT.md` matches the data in the file.
- [ ] Result of every item is recorded, with failures listed.

---

## Test log template

| Date | Tester | Browser / device | Sections failed | Notes |
|---|---|---|---|---|
|  |  |  |  |  |
