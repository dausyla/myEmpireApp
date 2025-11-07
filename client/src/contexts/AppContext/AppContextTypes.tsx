import type { User } from "../../types/AuthTypes";
import type { Portfolio } from "../../types/PortfolioTypes";

export type AppContextType = {
  currentPortfolioId: string | null;
  setCurrentPortfolioId: (id: string | null) => void;
  portfolios: Portfolio[] | null;
  setPortfolios: (portfolios: Portfolio[]) => void;
  savePortfolioInLocalStorage: (portfolio: Portfolio) => void;
  createNewPortfolioEmpty: (name?: string) => void;
  createNewPortfolioExample: (name?: string) => void;
  deletePortfolio: (id: string) => void;
  setUser: (usr: User | undefined) => void;
  user?: User;
};

export const PORTFOLIOS_STORAGE_KEY = "myEmpireApp_portfolios";
