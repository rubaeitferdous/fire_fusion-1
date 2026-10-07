import { Button } from "@/components/ui/Button";

type DemoDataStatusProps = {
  status: "loading" | "error";
  message?: string;
  onRetry?: () => void;
};

export function DemoDataStatus({ status, message, onRetry }: DemoDataStatusProps) {
  if (status === "loading") {
    return (
      <p className="demo-data-status" role="status" aria-live="polite">
        Loading illustrative demo data…
      </p>
    );
  }

  return (
    <div className="demo-data-status demo-data-error" role="alert">
      <p>{message ?? "Could not load illustrative demo data."}</p>
      {onRetry ? (
        <Button type="button" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
