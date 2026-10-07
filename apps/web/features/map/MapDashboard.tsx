"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { DemoDataNotice } from "@/components/ui/DemoDataNotice";
import { useDemoData } from "@/hooks/useDemoData";
import { EvidenceStandardPanel } from "@/features/map/EvidenceStandardPanel";
import { MapPanel } from "@/features/map/MapPanel";
import { SelectedEventPanel } from "@/features/map/SelectedEventPanel";

export function MapDashboard() {
  const request = useDemoData();
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const demo = request.status === "success" ? request.response : null;
  const selectedCluster =
    demo && selectedClusterId ? demo.data.clusters[selectedClusterId] : undefined;

  return (
    <>
      <div className="map-layout">
        <MapPanel
          detections={demo?.data.cells.raw ?? []}
          cells={demo?.data.cells.harmonised ?? []}
          loading={request.status === "loading"}
          error={request.status === "error" ? request.message : undefined}
          retry={request.retry}
          onSelectCluster={setSelectedClusterId}
          selectedClusterId={selectedClusterId}
        />
        <aside className="side-stack">
          <EvidenceStandardPanel />
          <SelectedEventPanel cluster={selectedCluster} />
          <Card className="guardrail" muted>
            <h2 className="section-heading">Honesty guardrail</h2>
            <p>Hotspots are detections, not fire perimeters.</p>
          </Card>
        </aside>
      </div>
      {demo ? <DemoDataNotice provenance={demo.provenance} /> : null}
    </>
  );
}
