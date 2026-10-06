import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MapDashboard } from "@/features/map/MapDashboard";

export const metadata: Metadata = { title: "Fire Activity Map" };

export default function MapPage() {
  return (
    <>
      <SiteHeader activePath="/map" title="Fire Activity Map" />
      <main className="main-content">
        <MapDashboard />
      </main>
    </>
  );
}
