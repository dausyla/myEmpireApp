import { createContext, useContext } from "react";
import { type PortfolioContextType } from "./PortfolioContextTypes";

export const PortfolioContext = createContext<PortfolioContextType>({
  portfolio: null,
  portfolioList: [],
  modifyPortfolio: () => {},
  createPortfolio: () => {},
  getPortfolio: () => {},
  getPortfolioTitles: () => {},
});

export function usePortfolio() {
  return useContext(PortfolioContext);
}
