import { Icon } from "@/components/icons";
import type { DemoMember } from "@/types/demo";

type SensorContributionCardProps = {
  member: DemoMember;
};

export function SensorContributionCard({ member }: SensorContributionCardProps) {
  return (
    <article className={`sensor-card sensor-card-${member.sensor.toLowerCase()}`}>
      <Icon name="layers" />
      <div className="sensor-name">
        <h3>
          {member.sensor} · {member.platform}
        </h3>
        <p>
          FRP {member.frp} MW · {member.conf_class} confidence
        </p>
        <time dateTime={member.ts_utc}>{member.ts_utc}</time>
      </div>
      <span className="source-label">Source evidence</span>
    </article>
  );
}
