"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type DataMode = "Raw" | "Harmonized";

type DataModeContextValue = {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
};

const DataModeContext = createContext<DataModeContextValue | null>(null);

export function DataModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DataMode>("Harmonized");

  return <DataModeContext.Provider value={{ mode, setMode }}>{children}</DataModeContext.Provider>;
}

export function useDataMode() {
  const context = useContext(DataModeContext);

  if (!context) {
    throw new Error("useDataMode must be used within a DataModeProvider");
  }

  return context;
}
