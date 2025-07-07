import { createContext, useContext } from "react";
import {
  emptyPortfolio,
  type PortfolioContextType,
} from "./PortfolioContextTypes";

export const PortofolioContext = createContext<PortfolioContextType>({
  portfolio: emptyPortfolio,
  modifyPortfolio: () => {},
});

export function usePortfolio() {
  return useContext(PortofolioContext);
}
