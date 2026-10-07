import type { Metadata } from "next";
import { PrototypeFrame } from "@/components/layout/PrototypeFrame";

export const metadata: Metadata = { title: "Cluster Evidence" };

export default function EvidenceEmptyPage() {
  return <PrototypeFrame screen="cluster" />;
}
