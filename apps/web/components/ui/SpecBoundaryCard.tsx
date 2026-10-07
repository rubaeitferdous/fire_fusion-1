import Link from "next/link";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { ModeToggle } from "@/components/ui/ModeToggle";

type SpecBoundaryCardProps = {
  title: string;
  description: string;
  detailTitle?: string;
  detail?: string;
  supportedTitle?: string;
  supported?: string;
  notSupported?: string;
  detailSingle?: boolean;
};

export function SpecBoundaryCard({
  title,
  description,
  detailTitle,
  detail,
  supportedTitle,
  supported,
  notSupported,
  detailSingle = false,
}: SpecBoundaryCardProps) {
  return (
    <Card className="spec-card">
      <div className="spec-icon">
        <Icon name="alert" />
      </div>
      <p className="spec-label">SPECIFICATION BOUNDARY</p>
      <h2 className="spec-title">{title}</h2>
      <p className="spec-copy">{description}</p>
      {supportedTitle && supported && notSupported ? (
        <div className="spec-details">
          <article className="spec-detail">
            <h3>{supportedTitle}</h3>
            <p>{supported}</p>
          </article>
          <article className="spec-detail">
            <h3>Not supported</h3>
            <p>{notSupported}</p>
          </article>
        </div>
      ) : detailTitle && detail ? (
        <div className={`spec-details${detailSingle ? " single" : ""}`}>
          <article className="spec-detail">
            <h3>{detailTitle}</h3>
            <p>{detail}</p>
          </article>
        </div>
      ) : null}
      <div className="spec-actions">
        <ModeToggle interactive={false} />
        <Link className="button" href="/methods">
          Review methods &amp; limitations
        </Link>
      </div>
    </Card>
  );
}
