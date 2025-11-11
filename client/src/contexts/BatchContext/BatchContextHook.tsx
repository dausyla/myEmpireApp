import { createContext, useContext } from "react";
import type { BatchContextType } from "./BatchContextTypes";

export const BatchContext = createContext<BatchContextType>({
  queue: [],
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
  addAssetValue: () => {},
  flush: async () => {},
});

export const useBatch = () => {
  const ctx = useContext(BatchContext);
  if (!ctx)
    throw new Error("useBatch must be used within PortfolioBatchProvider");
  return ctx;
};
