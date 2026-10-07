import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/Card";

export function EvidenceStandardPanel() {
  return (
    <Card>
      <h2 className="card-heading">Evidence standard</h2>
      <div className="standard-list">
        <div className="standard-item">
          <Icon name="layers" />
          <p>Raw observations are compared with harmonized results.</p>
        </div>
        <div className="standard-item">
          <Icon name="shield" />
          <p className="muted-text">Mapped confidence classes are required; raw numbers are not.</p>
        </div>
      </div>
    </Card>
  );
}
