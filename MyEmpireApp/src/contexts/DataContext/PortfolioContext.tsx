import { createContext, useContext } from "react";
import type { Portfolio } from "../../types/Assets";

export type PortfolioContextType = {
  portfolio: Portfolio;
  modifyPortfolio: (portfolio: Portfolio) => void;
};

export const emptyPortfolio: Portfolio = {
  id: "",
  name: "",
  description: "",
  assets: [],
  dates: [],
};

export const PortofolioContext = createContext<PortfolioContextType>({
  portfolio: emptyPortfolio,
  modifyPortfolio: () => {},
});

export function usePortfolio() {
  return useContext(PortofolioContext);
}

export const assetsExample = [
  {
    id: "1",
    name: "Bitcoin",
    values: [500, 510, 705, 720],
    inputs: [500, 0, 200, 0],
    prediction: {
      estimatedAPY: 0.05,
      monthlyInput: 200,
    },
  },
];

export const portfolioExemple: Portfolio = {
  id: "1",
  name: "My Portfolio",
  description: "This is an example portfolio",
  assets: assetsExample,
  dates: [1735689600000, 1738368000000, 1740787200000, 1743465600000],
};
