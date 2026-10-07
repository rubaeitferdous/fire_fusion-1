"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useDataMode } from "@/components/ui/DataModeProvider";
import { DemoDataNotice } from "@/components/ui/DemoDataNotice";
import { DemoDataStatus } from "@/components/ui/DemoDataStatus";
import { useDemoData } from "@/hooks/useDemoData";
import { SensorContributionCard } from "@/features/evidence/SensorContributionCard";
import type { DemoCluster } from "@/types/demo";

export function ClusterEvidenceData({ clusterId }: { clusterId: string }) {
  const request = useDemoData();

  if (request.status === "loading" || request.status === "error") {
    return (
      <Card>
        <DemoDataStatus
          status={request.status}
          message={request.status === "error" ? request.message : undefined}
          onRetry={request.retry}
        />
      </Card>
    );
  }

  const cluster = request.response.data.clusters[clusterId];
  if (!cluster) {
    return (
      <Card className="empty-state">
        <h2 className="card-heading">Demo cluster not found</h2>
        <p className="body-copy">This cluster is not included in the illustrative sample data.</p>
        <Link className="button" href="/map">
          Return to map
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <ClusterEvidenceContent cluster={cluster} />
      <DemoDataNotice provenance={request.response.provenance} />
    </Card>
  );
}

function ClusterEvidenceContent({ cluster }: { cluster: DemoCluster }) {
  const { mode } = useDataMode();
  const isRaw = mode === "Raw";

  return (
    <Card>
      <div className="heatmap-title-row">
        <div>
          <h2 className="card-heading">Contributing sensors</h2>
          <p className="body-copy">Clustering uses DBSCAN with a haversine metric.</p>
        </div>
        <span className="evidence-date">{cluster.local_date}</span>
      </div>
      {isRaw ? (
        <div className="sensor-list">
          {cluster.members.map((member) => (
            <SensorContributionCard key={member.det_id} member={member} />
          ))}
        </div>
      ) : (
        <dl className="selected-event-data evidence-summary">
          <div>
            <dt>MODIS detections</dt>
            <dd>{cluster.summary.n_modis}</dd>
          </div>
          <div>
            <dt>VIIRS detections</dt>
            <dd>{cluster.summary.n_viirs}</dd>
          </div>
          <div>
            <dt>Maximum FRP</dt>
            <dd>{cluster.summary.max_frp} MW</dd>
          </div>
          <div>
            <dt>Corroborated</dt>
            <dd>{cluster.corroborated ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Event score</dt>
            <dd>{cluster.event_score}</dd>
          </div>
        </dl>
      )}
    </Card>
  );
}
