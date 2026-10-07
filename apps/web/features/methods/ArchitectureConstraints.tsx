import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/Card";

const constraints = [
  {
    icon: "database",
    text: "Source dataset and processing context or run feed pre-computed Parquet data, queried with DuckDB to produce a displayed analytical result.",
  },
  { icon: "layers", text: "FastAPI serves the data layer." },
  {
    icon: "monitor",
    text: "Offline-first, read-only analysis is the intended operating approach.",
  },
  {
    icon: "zap",
    text: "Sub-second API responses and deployment portability are targets.",
  },
] as const;

export function ArchitectureConstraints() {
  return (
    <Card>
      <h2 className="card-heading">Architecture constraints</h2>
      <ul className="constraint-list">
        {constraints.map((constraint) => (
          <li key={constraint.text}>
            <Icon name={constraint.icon} />
            <span>{constraint.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
