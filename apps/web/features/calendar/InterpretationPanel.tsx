import { Card } from "@/components/ui/Card";

const interpretation = [
  {
    title: "Uncertainty",
    text: "Bootstrap intervals are required for harmonized data.",
  },
  {
    title: "Confidence",
    text: "Show mapped confidence classes, not raw values.",
  },
  {
    title: "Provenance",
    text: "Dataset IDs and processing run IDs must accompany displayed values.",
  },
] as const;

export function InterpretationPanel() {
  return (
    <Card>
      <h2 className="card-heading">Interpretation</h2>
      <div className="interpretation-list">
        {interpretation.map((item) => (
          <article className="interpretation-item" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
