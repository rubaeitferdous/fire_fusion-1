import type { Metadata } from "next";
import { PrototypeFrame } from "@/components/layout/PrototypeFrame";

export const metadata: Metadata = { title: "Burning Activity Calendar" };

export default function CalendarPage() {
  return <PrototypeFrame screen="calendar" />;
}
