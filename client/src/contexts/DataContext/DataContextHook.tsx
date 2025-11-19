import { createContext, useContext } from "react";
import { type DataContextType } from "./DataContextTypes";

export const DataContext = createContext<DataContextType>({
  getAssetPerformance: () => null,
  getSortedDates: () => [],
  getSortedValues: () => [],
});

export function useData() {
  return useContext(DataContext);
}
