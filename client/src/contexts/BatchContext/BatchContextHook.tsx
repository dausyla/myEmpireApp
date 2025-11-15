import { createContext, useContext } from "react";
import type { BatchContextType } from "./BatchContextTypes";

export const BatchContext = createContext<BatchContextType>({
  queue: [],
  flush: async () => {},

  // Transactions
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},

  // Asset Values
  addAssetValue: () => {},
  updateAssetValue: () => {},
  deleteAssetValue: () => {},

  // Dates
  addDate: () => {},
  updateDate: () => {},
  deleteDate: () => {},

  // Assets
  addAsset: () => {},
  updateAsset: () => {},
  deleteAsset: () => {},

  // Dirs
  addDir: () => {},
  updateDir: () => {},
  deleteDir: () => {},

  // Recurring Transactions
  addRecurring: () => {},
  updateRecurring: () => {},
  deleteRecurring: () => {},
});

export const useBatch = () => {
  const ctx = useContext(BatchContext);
  if (!ctx)
    throw new Error("useBatch must be used within PortfolioBatchProvider");
  return ctx;
};
