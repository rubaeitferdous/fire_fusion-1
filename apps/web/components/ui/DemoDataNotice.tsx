import type { DemoProvenance } from "@/types/demo";

export function DemoDataNotice({ provenance }: { provenance: DemoProvenance }) {
  return (
    <aside className="demo-data-notice" aria-label="Demo data provenance">
      <div>
        <strong>Illustrative demo data</strong>
        <p>Synthetic sample values, not live fire observations.</p>
      </div>
      <dl>
        <div>
          <dt>Datasets</dt>
          <dd>{provenance.datasets.join(", ")}</dd>
        </div>
        <div>
          <dt>Processing run</dt>
          <dd>{provenance.run_id}</dd>
        </div>
      </dl>
    </aside>
  );
}
