import { createContext, useContext } from "react";
import { type DataContextType } from "./DataContextTypes";

export const DataContext = createContext<DataContextType>({
  getAssetPerformance: () => null,
  getAssetPerformancePerDates: () => ({}),
  getSortedDates: () => [],
  getSortedValues: () => [],
  getSortedTransactions: () => [],
});

export function useData() {
  return useContext(DataContext);
}
