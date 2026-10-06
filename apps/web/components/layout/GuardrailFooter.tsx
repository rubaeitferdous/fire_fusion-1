import { Icon } from "@/components/icons";

export function GuardrailFooter() {
  return (
    <aside className="card card-muted guardrail-footer">
      <Icon name="info" />
      <p>Hotspots are detections, not fire perimeters.</p>
    </aside>
  );
}
