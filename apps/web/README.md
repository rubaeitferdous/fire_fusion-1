# FireFusion Web

FireFusion is a responsive web prototype for exploring satellite fire detections
from the MODIS and VIIRS sensor families. It presents map markers, daily
aggregates, cluster evidence, validation status, and methodology in a single
interactive interface.

> **Important:** This prototype is not a wildfire prediction or safety tool. It
> does not forecast fire spread, danger, or evacuation routes. The included
> dataset is illustrative demo data, not measured or live fire observations.

## Contents

- [Requirements](#requirements)
- [Run locally](#run-locally)
- [Available routes](#available-routes)
- [How the app is organized](#how-the-app-is-organized)
- [Demo data and limitations](#demo-data-and-limitations)
- [Checks](#checks)
- [Related documentation](#related-documentation)

## Requirements

- Node.js 20.9 or newer
- Bun 1.2.21, the package manager version specified by the repository

Install dependencies from the repository root:

```bash
bun install --frozen-lockfile
```

Do not install dependencies from this directory; the app is part of the
repository's Bun workspace.

## Run locally

From the repository root, start only the web workspace:

```bash
bun run dev --filter=web
```

Or start the app from this directory:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Run the app through the
development server rather than opening the HTML prototype directly: the page
loads its fixture using a same-origin request to `/data/dummy-data.json`.

To create and serve a production build from this directory:

```bash
bun run build
bun run start
```

## Available routes

| Route | Screen |
|---|---|
| `/` | Overview |
| `/map` | Fire activity map |
| `/calendar` | Burning activity calendar |
| `/evidence` | Cluster evidence, choosing a default cluster |
| `/evidence/[clusterId]` | Cluster evidence for the specified cluster |
| `/validation` | Validation metrics and demo run control |
| `/methods` | Methods and limitations |
| `/seasonal` | Redirects to `/calendar` |

The prototype also supports direct links with `screen` and `cluster` query
parameters. The Next.js route pages set the initial screen and, for an evidence
URL, the selected cluster.

## How the app is organized

The web app is a Next.js App Router workspace. Most route pages are lightweight
wrappers that select a screen in the prototype:

- `app/` contains route pages, the root layout, and shared app-level styles.
- `components/layout/PrototypeFrame.tsx` embeds the prototype in a responsive
  iframe and passes route state through its query string.
- `public/resources/FireFusion_Prototype_v14.html` contains the interactive
  screens, styling, and client-side behaviors.
- `public/data/dummy-data.json` is the demo fixture served at `/data/dummy-data.json`.
- `config/nav.ts` defines the outer application navigation.

The HTML prototype fetches and validates the fixture before drawing the map or
calendar. It shows a loading status while the request is pending and a visible
error message if the request or data validation fails. The map, calendar, and
cluster details are rendered in the iframe; Next.js provides the app routes and
embedding shell.

## Demo data and limitations

The data in `public/data/dummy-data.json` is labeled as demo-only and not
measured. In particular:

- Map data is provided only for **15 March 2026**.
- Calendar values are illustrative samples, not actual daily counts.
- Map `x` and `y` positions are placeholder percentages, not geographic
  coordinates.
- Validation results, seasonal anomaly percentiles, event scores, and real score
  components are not implemented. The validation button is a timed UI demo and
  performs no calculation.

Do not present these values as real observations. The full data-field
definitions, expected shapes, and implementation gaps are documented in the
[data contract](./public/resources/docs/DATA_CONTRACT.md).

## Checks

Run these workspace checks from `apps/web`:

```bash
bun run lint
bun run check-types
bun run build
```

There is no automated test script defined for this workspace. After changing
the standalone HTML prototype, use the
[smoke-test checklist](./public/resources/docs/SMOKE_TEST.md) to review its
screens, interactions, responsive behavior, and accessibility controls.

## Related documentation

- [Prototype instructions and feature notes](./public/resources/instructions.md)
- [Data contract and known gaps](./public/resources/docs/DATA_CONTRACT.md)
- [Prototype smoke-test checklist](./public/resources/docs/SMOKE_TEST.md)
