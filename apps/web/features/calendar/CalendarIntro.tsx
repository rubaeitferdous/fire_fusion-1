"use client";

import { Card } from "@/components/ui/Card";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useDataMode } from "@/components/ui/DataModeProvider";

export function CalendarIntro() {
  const { mode } = useDataMode();
  const isRaw = mode === "Raw";

  return (
    <Card className="intro-card">
      <div className="intro-copy">
        <p className="eyebrow">{isRaw ? "Raw temporal record" : "Harmonized temporal record"}</p>
        <h2 className="card-heading">Burning activity across the record</h2>
        <p className="body-copy">
          {isRaw
            ? "Daily raw event counts from MODIS and VIIRS detections."
            : "Calendar heatmap for harmonized MODIS and VIIRS detections. Bootstrap intervals communicate statistical reliability where available."}
        </p>
      </div>
      <ModeToggle />
    </Card>
  );
}
