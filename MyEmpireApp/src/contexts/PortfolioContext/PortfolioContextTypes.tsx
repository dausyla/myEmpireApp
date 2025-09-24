import type { Portfolio } from "../../types/PortfolioTypes";

export type PortfolioContextType = {
  portfolio: Portfolio | null;
  modifyPortfolio: (portfolio: Portfolio) => void;
  isModified: boolean;
  savePortfolio: () => void;
  addDate: (date: number) => void;
  editDate: (oldDate: number, newDate: number) => void;
  deleteDate: (date: number) => void;
};
