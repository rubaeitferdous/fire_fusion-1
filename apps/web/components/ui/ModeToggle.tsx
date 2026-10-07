"use client";

import { useDataMode } from "@/components/ui/DataModeProvider";

type ModeToggleProps = {
  interactive?: boolean;
};

export function ModeToggle({ interactive = true }: ModeToggleProps) {
  const { mode, setMode } = useDataMode();

  return (
    <div aria-label="Data mode" className="mode-toggle" role="group">
      {(["Raw", "Harmonized"] as const).map((option) => (
        <button
          key={option}
          aria-pressed={mode === option}
          disabled={!interactive}
          onClick={() => setMode(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
