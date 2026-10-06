import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SpecBoundaryCard } from "@/components/ui/SpecBoundaryCard";

export const metadata: Metadata = {
  title: "Seasonal Baseline & Anomaly",
};

export default function SeasonalPage() {
  return (
    <>
      <SiteHeader activePath="/seasonal" title="Seasonal Baseline & Anomaly" />
      <main className="main-content">
        <SpecBoundaryCard
          description="The FireFusion system design supports harmonization, clustering, calibration, aggregation, uncertainty bands, provenance, geospatial visualization, and calendar heatmaps. It does not specify baseline or anomaly concepts, relationships, visualizations, metrics, interactions, or states."
          detail="NOT SPECIFIED — DO NOT INVENT."
          detailTitle="Required interpretation"
          detailSingle
          title="Seasonal baseline and anomaly functionality is not specified"
        />
      </main>
    </>
  );
}
