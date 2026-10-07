type PrototypeScreen = "overview" | "map" | "calendar" | "cluster" | "validation" | "methods";

type PrototypeFrameProps = {
  screen: PrototypeScreen;
  clusterId?: string;
};

export function PrototypeFrame({ screen, clusterId }: PrototypeFrameProps) {
  const query = new URLSearchParams({ screen });
  if (clusterId) query.set("cluster", clusterId);

  return (
    <iframe
      className="prototype-frame"
      src={`/resources/FireFusion_Prototype_v14.html?${query.toString()}`}
      title="FireFusion sensor-harmonized wildfire intelligence"
    />
  );
}
