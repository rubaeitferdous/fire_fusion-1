import { Card } from "@/components/ui/Card";
import { pipelineStages } from "@/content/pipeline";

export function ProcessingLineage() {
  return (
    <Card>
      <h2 className="card-heading">Processing lineage</h2>
      <ol className="lineage-list">
        {pipelineStages.map((stage, index) => (
          <li className="lineage-item" key={stage.title}>
            <span className="lineage-number">{index + 1}</span>
            <span>{stage.title}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
