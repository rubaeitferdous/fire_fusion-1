"use client";

import { Icon } from "@/components/icons";
import { useDataMode } from "@/components/ui/DataModeProvider";
import { Card } from "@/components/ui/Card";
import { DemoDataNotice } from "@/components/ui/DemoDataNotice";
import { DemoDataStatus } from "@/components/ui/DemoDataStatus";
import { NotSpecified } from "@/components/ui/NotSpecified";
import { useDemoData } from "@/hooks/useDemoData";

export function CalendarHeatmap() {
  const { mode } = useDataMode();
  const request = useDemoData();
  const demo = request.status === "success" ? request.response : null;
  const days = demo?.data.calendar[mode === "Raw" ? "raw" : "harmonised"] ?? [];
  const minCount = days.length ? Math.min(...days.map((day) => day.count)) : 0;
  const maxCount = days.length ? Math.max(...days.map((day) => day.count)) : 0;

  return (
    <Card className="heatmap-card">
      <div className="heatmap-title-row">
        <div>
          <h2 className="card-heading">Calendar heatmap</h2>
          <p className="body-copy">
            Temporal aggregation method: <NotSpecified />
          </p>
        </div>
        <Icon name="calendar" />
      </div>
      {request.status === "loading" || request.status === "error" ? (
        <DemoDataStatus
          status={request.status}
          message={request.status === "error" ? request.message : undefined}
          onRetry={request.retry}
        />
      ) : days.length === 0 ? (
        <p className="demo-data-status" role="status">
          No demo calendar records are available.
        </p>
      ) : (
        <>
          <div
            className="heatmap-grid demo-calendar-grid"
            aria-label={`${mode} daily demo activity`}
          >
            {days.map((day) => {
              const ratio =
                maxCount === minCount ? 1 : (day.count - minCount) / (maxCount - minCount);
              const date = new Date(`${day.date}T00:00:00Z`);
              const label = new Intl.DateTimeFormat("en", {
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              }).format(date);

              return (
                <article
                  className="heat-cell demo-calendar-cell"
                  key={day.date}
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--primary) ${Math.round(15 + ratio * 85)}%, var(--muted))`,
                  }}
                  title={`${day.date}: ${day.count}${day.lo !== undefined && day.hi !== undefined ? ` (${day.lo}–${day.hi})` : ""}`}
                >
                  <time dateTime={day.date}>{label}</time>
                  <strong>{day.count}</strong>
                  {day.lo !== undefined && day.hi !== undefined ? (
                    <span className="demo-calendar-interval">
                      {day.lo}–{day.hi}
                    </span>
                  ) : null}
                </article>
              );
            })}
          </div>
          <div className="heatmap-legend">
            <span>
              Lower
              <span aria-hidden="true" className="legend-dots">
                <span className="legend-dot" />
                <span className="legend-dot" />
                <span className="legend-dot" />
                <span className="legend-dot" />
              </span>
            </span>
            <span>Higher relative burning activity intensity / count</span>
          </div>
          <p className="demo-period">
            Sample period: {days.at(0)?.date} – {days.at(-1)?.date} ·{" "}
            {mode === "Raw" ? "raw event counts" : "harmonized counts with intervals"}
          </p>
        </>
      )}
      {demo ? <DemoDataNotice provenance={demo.provenance} /> : null}
    </Card>
  );
}
