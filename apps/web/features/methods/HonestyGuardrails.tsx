import { Card } from "@/components/ui/Card";
import { guardrails } from "@/content/guardrails";

export function HonestyGuardrails() {
  return (
    <Card muted>
      <h2 className="card-heading">Honesty guardrails</h2>
      <ul className="honesty-list">
        {guardrails.map((guardrail) => (
          <li key={guardrail}>{guardrail}</li>
        ))}
      </ul>
    </Card>
  );
}
