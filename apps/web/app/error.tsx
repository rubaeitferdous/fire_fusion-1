"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="main-content">
      <Card className="empty-state">
        <h1 className="card-heading">FireFusion is temporarily unavailable</h1>
        <p className="body-copy">
          An unexpected error occurred while loading this screen. Please try again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </Card>
    </main>
  );
}
