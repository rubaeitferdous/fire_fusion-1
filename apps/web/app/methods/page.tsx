import type { Metadata } from "next";
import { PrototypeFrame } from "@/components/layout/PrototypeFrame";

export const metadata: Metadata = { title: "Methods & Limitations" };

export default function MethodsPage() {
  return <PrototypeFrame screen="methods" />;
}
