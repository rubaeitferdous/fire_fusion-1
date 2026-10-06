import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GuardrailFooter } from "@/components/layout/GuardrailFooter";
import { CalendarIntro } from "@/features/calendar/CalendarIntro";
import { CalendarHeatmap } from "@/features/calendar/CalendarHeatmap";
import { InterpretationPanel } from "@/features/calendar/InterpretationPanel";

export const metadata: Metadata = { title: "Burning Activity Calendar" };

export default function CalendarPage() {
  return (
    <>
      <SiteHeader activePath="/calendar" title="Burning Activity Calendar" />
      <main className="main-content">
        <CalendarIntro />
        <div className="calendar-layout">
          <CalendarHeatmap />
          <InterpretationPanel />
        </div>
        <GuardrailFooter />
      </main>
    </>
  );
}
