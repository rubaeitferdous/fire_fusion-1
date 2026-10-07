import type { Metadata } from "next";
import { PrototypeFrame } from "@/components/layout/PrototypeFrame";

export const metadata: Metadata = { title: "Validation Metrics" };

export default function ValidationPage() {
  return <PrototypeFrame screen="validation" />;
}
