import { useEffect, useState, type ReactNode } from "react";
import type { Portfolio } from "../../types/PortfolioTypes";
import { PortofolioContext } from "./PortfolioContextHook";
import { useAppContext } from "../AppContext/AppContextHook";

export const PortofolioContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { currentPortfolioId, portfolios, savePortfolioInLocalStorage } =
    useAppContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isModified, setIsModified] = useState(false);

  // Load portfolio from localStorage on first render
  useEffect(() => {
    const p = portfolios?.find((p) => p.id === currentPortfolioId);
    if (p) {
      setPortfolio(JSON.parse(JSON.stringify(p)));
      setIsModified(false);
    } else {
      setPortfolio(null);
      setIsModified(false);
    }
  }, [currentPortfolioId, portfolios]);

  const modifyPortfolio = (newPortfolio: Portfolio) => {
    const cloned = JSON.parse(JSON.stringify(newPortfolio));
    setPortfolio(cloned);
    setIsModified(true);
  };

  const savePortfolio = () => {
    if (!portfolio) return;
    try {
      savePortfolioInLocalStorage(portfolio);
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
        savePortfolio, // expose it to consumers
        isModified,
      }}
    >
      {children}
    </PortofolioContext.Provider>
  );
};
