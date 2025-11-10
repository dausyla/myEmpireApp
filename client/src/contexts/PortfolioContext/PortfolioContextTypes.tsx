import type { Portfolio, PortfolioList } from "../../types/PortfolioTypes";

export type PortfolioContextType = {
  portfolio: Portfolio | null;
  portfolioList: PortfolioList;
  modifyPortfolio: (portfolio: Portfolio) => void;
  createPortfolio: (title: string, description: string) => void;
  getPortfolioTitles: () => void;
  getPortfolio: (walletId: number) => void;
};
