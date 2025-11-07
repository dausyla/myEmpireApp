import { createContext, useContext } from "react";
import type { AppContextType } from "./AppContextTypes";

export const AppContext = createContext<AppContextType>({
  currentPortfolioId: null,
  setCurrentPortfolioId: () => {},
  portfolios: [],
  setPortfolios: () => {},
  savePortfolioInLocalStorage: () => {},
  createNewPortfolioEmpty: () => {},
  createNewPortfolioExample: () => {},
  deletePortfolio: () => {},
  setUser: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}
