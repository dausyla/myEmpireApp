import type { Portfolio } from "../../types/Assets";

export type AppContextType = {
  currentPortfolioId: string | null;
  setCurrentPortfolioId: (id: string | null) => void;
  portfolios: Portfolio[] | null;
  setPortfolios: (portfolios: Portfolio[]) => void;
  savePortfolioInLocalStorage: (portfolio: Portfolio) => void;
  createNewPortfolioEmpty: (name?: string) => void;
  createNewPortfolioExample: (name?: string) => void;
  deletePortfolio: (id: string) => void;
};

export const PORTFOLIOS_STORAGE_KEY = "myEmpireApp_portfolios";
