import { pipelineStages } from "@/content/pipeline";

export function PipelineStages() {
  return (
    <section className="card">
      <h2 className="card-heading">Pipeline stages</h2>
      <div className="method-stage-list">
        {pipelineStages.map((stage, index) => (
          <article className="method-stage" key={stage.title}>
            <h3>
              {String(index + 1).padStart(2, "0")} · {stage.title}
            </h3>
            <p>{stage.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
