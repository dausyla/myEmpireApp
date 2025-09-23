import type { Asset, Portfolio } from "../../types/Assets";

export type PortfolioContextType = {
  portfolio: Portfolio | null;
  modifyPortfolio: (portfolio: Portfolio) => void;
  isModified: boolean;
  savePortfolio: () => void;
  addDate: (date: number) => void;
  editDate: (oldDate: number, newDate: number) => void;
  deleteDate: (date: number) => void;
};

export const emptyPortfolio: Portfolio = {
  id: "",
  name: "New Portfolio",
  description: "Portfolio Description",
  assets: [],
  dates: [],
};

export const assetsExample: Asset[] = [
  {
    id: 1,
    name: "Bitcoin",
    values: [500, 510, 705, 720],
    inputs: [500, 0, 200, 0],
    prediction: {
      estimatedAPY: 0.05,
      monthlyInput: 200,
    },
    color: { r: 255, g: 204, b: 0 }, // Yellow
  },
];

export const portfolioExample: Portfolio = {
  id: "",
  name: "Portfolio Example",
  description: "This is an example portfolio",
  assets: assetsExample,
  dates: [1735689600000, 1738368000000, 1740787200000, 1743465600000],
};
