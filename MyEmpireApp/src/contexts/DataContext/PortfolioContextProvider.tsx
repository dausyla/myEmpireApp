import { useState, type ReactNode } from "react";
import type { Portfolio } from "../../types/Assets";
import {
  // emptyPortfolio,
  portfolioExemple,
  PortofolioContext,
} from "./PortfolioContext";

export const PortofolioContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [portfolio, setPortfolio] = useState<Portfolio>(portfolioExemple);

  const modifyPortfolio = (newPortfolio: Portfolio) => {
    setPortfolio(JSON.parse(JSON.stringify(newPortfolio)));
  };

  return (
    <PortofolioContext.Provider
      value={{
        portfolio,
        modifyPortfolio,
      }}
    >
      {children}
    </PortofolioContext.Provider>
  );
};
