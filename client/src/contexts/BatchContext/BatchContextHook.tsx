import { createContext, useContext } from "react";
import type { BatchContextType } from "./BatchContextTypes";

export const BatchContext = createContext<BatchContextType | null>(null);

export const useBatch = () => {
  const ctx = useContext(BatchContext);
  if (!ctx)
    throw new Error("useBatch must be used within PortfolioBatchProvider");
  return ctx;
};
