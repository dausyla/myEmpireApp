import { useState, type ReactNode } from "react";
import type { Portfolio } from "../../types/Assets";
import { PortofolioContext } from "./PortfolioContextHook";
import { portfolioExemple } from "./PortfolioContextTypes";

export const PortofolioContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [portfolio, setPortfolio] = useState<Portfolio>(portfolioExemple);
  const [editingAssetId, setEditingAssetId] = useState<number>(-1);

  const modifyPortfolio = (newPortfolio: Portfolio) => {
    setPortfolio(JSON.parse(JSON.stringify(newPortfolio)));
  };

  return (
    <PortofolioContext.Provider
      value={{
        portfolio,
        modifyPortfolio,
        editingAssetId,
        setEditingAssetId,
      }}
    >
      {children}
    </PortofolioContext.Provider>
  );
};
