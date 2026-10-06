export type ConfidenceClass = "low" | "nominal" | "high";

export type DemoDetection = {
  det_id: string;
  lat: number;
  lon: number;
  sensor_family: "MODIS" | "VIIRS";
  conf_class: ConfidenceClass;
  frp_mw: number;
  ts_utc: string;
  cluster_id: string;
};

export type DemoCell = {
  cluster_id: string;
  centroid_lat: number;
  centroid_lon: number;
  event_count: number;
  corroborated_pct: number;
  max_frp: number;
  best_conf_class: ConfidenceClass;
};

export type DemoCalendarDay = {
  date: string;
  count: number;
  lo?: number;
  hi?: number;
};

export type DemoMember = {
  det_id: string;
  sensor: "MODIS" | "VIIRS";
  platform: string;
  frp: number;
  conf_class: ConfidenceClass;
  ts_utc: string;
};

export type DemoCluster = {
  cluster_id: string;
  local_date: string;
  centroid: { lat: number; lon: number };
  corroborated: boolean;
  event_score: number;
  summary: { n_modis: number; n_viirs: number; max_frp: number };
  members: DemoMember[];
};

export type DemoData = {
  cells: {
    raw: DemoDetection[];
    harmonised: DemoCell[];
  };
  calendar: {
    raw: DemoCalendarDay[];
    harmonised: DemoCalendarDay[];
  };
  clusters: Record<string, DemoCluster>;
};

export type DemoProvenance = {
  datasets: string[];
  parameters: Record<string, string>;
  run_id: string;
  git_sha: string;
};

export type DemoEnvelope = {
  status: "ok";
  data: DemoData;
  error: null;
  provenance: DemoProvenance;
};
