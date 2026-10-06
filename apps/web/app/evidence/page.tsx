import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "Cluster Evidence" };

export default function EvidenceEmptyPage() {
  return (
    <>
      <SiteHeader activePath="/evidence" title="Cluster Evidence" />
      <main className="main-content">
        <Card className="empty-state">
          <Icon name="layers" />
          <h2 className="card-heading">No cluster selected</h2>
          <p className="body-copy">
            Choose a cluster from the fire activity map to inspect its sensor contributions and
            processing lineage.
          </p>
          <Button href="/map">Return to map</Button>
        </Card>
      </main>
    </>
  );
}
