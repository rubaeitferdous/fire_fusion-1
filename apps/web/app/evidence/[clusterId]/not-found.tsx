import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";

export default function ClusterNotFound() {
  return (
    <>
      <SiteHeader activePath="/evidence" title="Cluster Evidence" />
      <main className="main-content">
        <Card className="empty-state">
          <Icon name="alert" />
          <h2 className="card-heading">Cluster not found</h2>
          <p className="body-copy">
            This cluster could not be found. Return to the map to choose an available cluster.
          </p>
          <Button href="/map">Return to map</Button>
        </Card>
      </main>
    </>
  );
}
