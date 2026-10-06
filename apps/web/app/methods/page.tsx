import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArchitectureConstraints } from "@/features/methods/ArchitectureConstraints";
import { HonestyGuardrails } from "@/features/methods/HonestyGuardrails";
import { PipelineStages } from "@/features/methods/PipelineStages";

export const metadata: Metadata = { title: "Methods & Limitations" };

export default function MethodsPage() {
  return (
    <>
      <SiteHeader activePath="/methods" title="Methods & Limitations" />
      <main className="main-content">
        <section className="card">
          <p className="eyebrow">System design record</p>
          <h2 className="section-heading method-intro-heading">
            Deterministic harmonization pipeline
          </h2>
          <p className="body-copy">
            MODIS and VIIRS are distinct FIRMS satellite-sensor sources with different spatial
            resolution and detection sensitivity. FireFusion harmonization helps reduce
            sensor-related differences from being misread as changes in burning activity; raw
            detections remain source-preserving and traceable.
          </p>
        </section>
        <div className="methods-layout">
          <PipelineStages />
          <div className="side-stack">
            <ArchitectureConstraints />
            <HonestyGuardrails />
          </div>
        </div>
      </main>
    </>
  );
}
