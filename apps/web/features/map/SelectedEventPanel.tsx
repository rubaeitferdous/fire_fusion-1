import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DemoCluster } from "@/types/demo";

export function SelectedEventPanel({ cluster }: { cluster?: DemoCluster }) {
  return (
    <Card>
      <h2 className="card-heading">Selected-event details</h2>
      {cluster ? (
        <>
          <dl className="selected-event-data">
            <div>
              <dt>Date</dt>
              <dd>{cluster.local_date}</dd>
            </div>
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
          </dl>
          <Button className="full-width" href={`/evidence/${cluster.cluster_id}`}>
            View cluster evidence
          </Button>
        </>
      ) : (
        <p className="selected-copy">Select a demo map marker to inspect its cluster evidence.</p>
      )}
    </Card>
  );
}
