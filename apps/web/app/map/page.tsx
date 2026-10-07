import type { Metadata } from "next";
import { PrototypeFrame } from "@/components/layout/PrototypeFrame";

export const metadata: Metadata = { title: "Fire Activity Map" };

export default function MapPage() {
  return <PrototypeFrame screen="map" />;
}
