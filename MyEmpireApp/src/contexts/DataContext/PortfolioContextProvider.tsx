import { useEffect, useState, type ReactNode } from "react";
import type { Portfolio } from "../../types/Assets";
import { PortofolioContext } from "./PortfolioContextHook";
import { emptyPortfolio } from "./PortfolioContextTypes";

const STORAGE_KEY = "portfolioData";

export const PortofolioContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [portfolio, setPortfolio] = useState<Portfolio>(emptyPortfolio);
  const [editingAssetId, setEditingAssetId] = useState<number>(-1);
  const [isModified, setIsModified] = useState(false);

  // Load portfolio from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved portfolio:", err);
      }
    }
  }, []);

  const modifyPortfolio = (newPortfolio: Portfolio) => {
    const cloned = JSON.parse(JSON.stringify(newPortfolio));
    setPortfolio(cloned);
    setIsModified(true);
  };

  const savePortfolio = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
      setIsModified(false);
      console.log("Portfolio saved to localStorage ✅");
    } catch (err) {
      console.error("Failed to save portfolio:", err);
    }
  };

  return (
    <PortofolioContext.Provider
      value={{
        portfolio,
        modifyPortfolio,
        editingAssetId,
        setEditingAssetId,
        savePortfolio, // expose it to consumers
        isModified,
      }}
    >
      {children}
    </PortofolioContext.Provider>
  );
};
