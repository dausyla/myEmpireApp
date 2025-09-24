import { createContext, useContext } from "react";
import { type PortfolioContextType } from "./PortfolioContextTypes";

export const PortofolioContext = createContext<PortfolioContextType>({
  portfolio: null,
  modifyPortfolio: () => {},
  savePortfolio: () => {},
  isModified: false,
  addDate: () => {},
  editDate: () => {},
  deleteDate: () => {},
});

export function usePortfolio() {
  return useContext(PortofolioContext);
}
