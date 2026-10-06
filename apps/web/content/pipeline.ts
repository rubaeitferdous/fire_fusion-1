export const pipelineStages = [
  {
    title: "Acquisition",
    description: "Individual FIRMS detections are source observations.",
  },
  {
    title: "Normalization",
    description: "Mapping source-preserving detections to a canonical schema.",
  },
  {
    title: "Spatio-temporal clustering",
    description:
      "DBSCAN groups spatially and temporally related detections into candidate fire-event clusters. These clusters are derived analytical interpretations, not ground-truth confirmation, burned-area or perimeter measurements, or incident records.",
  },
  {
    title: "Calibration",
    description:
      "Poisson GLM provides applicable calibration and detectability treatment within the harmonization workflow.",
  },
  {
    title: "Aggregation",
    description: "Daily aggregates summarize the derived clustered events for analysis.",
  },
] as const;
