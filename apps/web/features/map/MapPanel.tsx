"use client";

import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { DemoDataStatus } from "@/components/ui/DemoDataStatus";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useDataMode } from "@/components/ui/DataModeProvider";
import type { DemoCell, DemoDetection } from "@/types/demo";

type MapPanelProps = {
  detections: DemoDetection[];
  cells: DemoCell[];
  loading: boolean;
  error?: string;
  retry: () => void;
  selectedClusterId: string | null;
  onSelectCluster: (clusterId: string) => void;
};

const bounds = { west: 88, east: 93, south: 20, north: 27 };

export function MapPanel({
  detections,
  cells,
  loading,
  error,
  retry,
  selectedClusterId,
  onSelectCluster,
}: MapPanelProps) {
  const { mode } = useDataMode();
  const isRaw = mode === "Raw";
  const markers = isRaw
    ? detections.map((detection) => ({
        id: detection.det_id,
        clusterId: detection.cluster_id,
        latitude: detection.lat,
        longitude: detection.lon,
        confidenceClass: detection.conf_class,
        sensor: detection.sensor_family,
      }))
    : cells.map((cell) => ({
        id: cell.cluster_id,
        clusterId: cell.cluster_id,
        latitude: cell.centroid_lat,
        longitude: cell.centroid_lon,
        confidenceClass: cell.best_conf_class,
        sensor: undefined,
      }));

  return (
    <Card className="map-card">
      <div className="map-card-head">
        <div>
          <h2 className="section-heading">Geospatial detections</h2>
          <p className="body-copy">
            {isRaw
              ? "Raw MODIS and VIIRS sensor detections."
              : "Harmonized fire-event cells; confidence is shown as mapped classes."}
          </p>
        </div>
        <ModeToggle />
      </div>
      <div className="map-viewport demo-map-viewport">
        {loading || error ? (
          <DemoDataStatus status={loading ? "loading" : "error"} message={error} onRetry={retry} />
        ) : (
          <>
            <div className="demo-map-caption">
              <Icon name="map-pin" />
              <span>Illustrative sample coordinates · not a geographic basemap</span>
            </div>
            <div className="demo-map-plot" aria-label={`${mode} demo fire detections`}>
              {markers.map((marker) => {
                return (
                  <button
                    aria-label={
                      isRaw
                        ? `${marker.sensor} detection, ${marker.confidenceClass} confidence class`
                        : `Harmonized event, ${marker.confidenceClass} confidence class`
                    }
                    aria-pressed={selectedClusterId === marker.clusterId}
                    className={`demo-map-marker${marker.sensor ? ` sensor-${marker.sensor.toLowerCase()}` : ` harmonized-marker confidence-${marker.confidenceClass}`}${selectedClusterId === marker.clusterId ? " selected" : ""}`}
                    key={marker.id}
                    onClick={() => onSelectCluster(marker.clusterId)}
                    style={{
                      left: `${((marker.longitude - bounds.west) / (bounds.east - bounds.west)) * 100}%`,
                      top: `${((bounds.north - marker.latitude) / (bounds.north - bounds.south)) * 100}%`,
                    }}
                    title={`${marker.confidenceClass} confidence class`}
                    type="button"
                  />
                );
              })}
            </div>
            <div className="demo-map-axis demo-map-axis-x">
              <span>88°E</span>
              <span>90.5°E</span>
              <span>93°E</span>
            </div>
            <div className="demo-map-axis demo-map-axis-y">
              <span>27°N</span>
              <span>23.5°N</span>
              <span>20°N</span>
            </div>
            <div className="demo-map-legend" aria-label="Map legend">
              {isRaw ? (
                <>
                  <span>
                    <i className="legend-swatch sensor-modis" /> MODIS
                  </span>
                  <span>
                    <i className="legend-swatch sensor-viirs" /> VIIRS
                  </span>
                </>
              ) : (
                <>
                  <span>
                    <i className="legend-swatch confidence-high" /> High
                  </span>
                  <span>
                    <i className="legend-swatch confidence-nominal" /> Nominal
                  </span>
                  <span>
                    <i className="legend-swatch confidence-low" /> Low
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
