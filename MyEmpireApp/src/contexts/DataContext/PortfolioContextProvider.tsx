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

  const addDate = (date: number) => {
    if (portfolio.dates.includes(date)) {
      alert("This date already exists!");
      return;
    }

    portfolio.dates.push(date);
    portfolio.dates.sort((a, b) => a - b);
    const index = portfolio.dates.indexOf(date);
    portfolio.assets.forEach((asset) => {
      const previousValue = index > 0 ? asset.values[index - 1] : 0;
      asset.values.splice(index, 0, previousValue);
      asset.inputs.splice(index, 0, 0);
    });

    modifyPortfolio(portfolio);
  };

  const editDate = (oldDate: number, newDate: number) => {
    if (portfolio.dates.includes(newDate)) {
      alert("This date already exists!");
      return;
    }

    const index = portfolio.dates.indexOf(oldDate);
    if (index === -1) return;

    portfolio.dates[index] = newDate;
    portfolio.dates.sort((a, b) => a - b);

    portfolio.assets.forEach((asset) => {
      const value = asset.values.splice(index, 1)[0];
      const input = asset.inputs.splice(index, 1)[0];
      const newIndex = portfolio.dates.indexOf(newDate);
      asset.values.splice(newIndex, 0, value);
      asset.inputs.splice(newIndex, 0, input);
    });

    modifyPortfolio(portfolio);
  };

  const deleteDate = (date: number) => {
    const index = portfolio.dates.indexOf(date);
    if (index === -1) return;

    portfolio.dates.splice(index, 1);
    portfolio.assets.forEach((asset) => {
      asset.values.splice(index, 1);
      asset.inputs.splice(index, 1);
    });

    modifyPortfolio(portfolio);
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
        addDate,
        editDate,
        deleteDate,
      }}
    >
      {children}
    </PortofolioContext.Provider>
  );
};
