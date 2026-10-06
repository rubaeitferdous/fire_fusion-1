import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { NotSpecified } from "@/components/ui/NotSpecified";
import { ClusterEvidenceData } from "@/features/evidence/ClusterEvidenceData";
import { ProcessingLineage } from "@/features/evidence/ProcessingLineage";

type ClusterEvidencePageProps = {
  params: Promise<{ clusterId: string }>;
};

export async function generateMetadata({ params }: ClusterEvidencePageProps): Promise<Metadata> {
  const { clusterId } = await params;
  return { title: `Cluster Evidence ${clusterId}` };
}

export default async function ClusterEvidencePage({ params }: ClusterEvidencePageProps) {
  const { clusterId } = await params;
  if (!clusterId.trim()) notFound();

  return (
    <>
      <SiteHeader activePath="/evidence" title="Cluster Evidence" />
      <main className="main-content">
        <Card className="evidence-intro">
          <div className="evidence-intro-copy">
            <p className="eyebrow">Event-level inspection</p>
            <h2 className="card-heading">Sensor contribution evidence</h2>
            <p className="body-copy">
              Inspect which sensors contributed to a specific fire event and trace displayed values
              to source datasets and processing runs.
            </p>
          </div>
          <div className="intro-actions">
            <ModeToggle />
            <Button href="/map">
              <Icon name="arrow-left" />
              Return to map
            </Button>
          </div>
        </Card>
        <div className="evidence-layout">
          <ClusterEvidenceData clusterId={clusterId} />
          <ProcessingLineage />
        </div>
        <Card className="provenance-card card-muted">
          <h2 className="card-heading">Provenance requirement</h2>
          <p>
            Every displayed number must be traceable to a dataset ID and processing run. Exact
            identifier format: <NotSpecified />
          </p>
        </Card>
      </main>
    </>
  );
}
