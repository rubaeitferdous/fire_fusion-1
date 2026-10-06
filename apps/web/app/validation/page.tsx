import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SpecBoundaryCard } from "@/components/ui/SpecBoundaryCard";

export const metadata: Metadata = { title: "Validation Metrics" };

export default function ValidationPage() {
  return (
    <>
      <SiteHeader activePath="/validation" title="Validation Metrics" />
      <main className="main-content">
        <SpecBoundaryCard
          description="The system design requires statistical reliability to be communicated through bootstrap intervals and requires traceability through provenance metadata. It does not specify validation methods, validation metrics, thresholds, benchmarks, charts, data states, or interactions."
          notSupported="Validation measures: NOT SPECIFIED — DO NOT INVENT."
          supported="Bootstrap intervals communicate statistical reliability."
          supportedTitle="Supported"
          title="Validation metrics are not specified"
        />
      </main>
    </>
  );
}
