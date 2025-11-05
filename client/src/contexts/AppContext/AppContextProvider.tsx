import { useEffect, useState, type ReactNode } from "react";
import { AppContext } from "./AppContextHook";
import { PORTFOLIOS_STORAGE_KEY } from "./AppContextTypes";
import type { Portfolio } from "../../types/PortfolioTypes";
import {
  emptyPortfolio,
  portfolioExample,
} from "../../types/PortfolioExamples";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentPortfolioId, setCurrentPortfolioId] = useState<string | null>(
    null
  );
  const [portfolios, setPortfolios] = useState<Portfolio[] | null>(null);

  // Load portfolios from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem(PORTFOLIOS_STORAGE_KEY);
    if (saved) {
      try {
        setPortfolios(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved portfolio:", err);
      }
    }
  }, []);

  // If there is no current portfolio, set it to the first one in the list
  useEffect(() => {
    if (portfolios && portfolios.length > 0 && currentPortfolioId === null) {
      setCurrentPortfolioId(portfolios[0].id);
    }
  }, [portfolios, currentPortfolioId]);

  const savePortfolioInLocalStorage = (portfolio: Portfolio) => {
    if (!portfolios) {
      setPortfolios([portfolio]);
      localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify([portfolio]));
      return;
    }

    const existingIndex = portfolios.findIndex((p) => p.id === portfolio.id);
    let updatedPortfolios: Portfolio[];
    if (existingIndex !== -1) {
      // Update existing portfolio
      updatedPortfolios = [...portfolios];
      updatedPortfolios[existingIndex] = portfolio;
    } else {
      // Add new portfolio
      updatedPortfolios = [...portfolios, portfolio];
    }
    setPortfolios(updatedPortfolios);
    try {
      localStorage.setItem(
        PORTFOLIOS_STORAGE_KEY,
        JSON.stringify(updatedPortfolios)
      );
      console.log("Portfolio saved to localStorage ✅");
    } catch (err) {
      console.error("Failed to save portfolio:", err);
    }
  };

  const createNewPortfolioEmpty = (name?: string) => {
    const newPortfolio = emptyPortfolio;
    newPortfolio.id = crypto.randomUUID();
    while (portfolios?.some((p) => p.id === newPortfolio.id)) {
      newPortfolio.id = crypto.randomUUID();
    }
    if (name) newPortfolio.name = name;
    savePortfolioInLocalStorage(newPortfolio);
    setCurrentPortfolioId(newPortfolio.id);
  };

  const createNewPortfolioExample = (name?: string) => {
    const newPortfolio = portfolioExample;
    newPortfolio.id = crypto.randomUUID();
    while (portfolios?.some((p) => p.id === newPortfolio.id)) {
      newPortfolio.id = crypto.randomUUID();
    }
    if (name) newPortfolio.name = name;
    savePortfolioInLocalStorage(newPortfolio);
    setCurrentPortfolioId(newPortfolio.id);
  };

  const deletePortfolio = (id: string) => {
    if (!portfolios) return;
    const updatedPortfolios = portfolios.filter((p) => p.id !== id);
    setPortfolios(updatedPortfolios);
    localStorage.setItem(
      PORTFOLIOS_STORAGE_KEY,
      JSON.stringify(updatedPortfolios)
    );
    if (currentPortfolioId === id) {
      setCurrentPortfolioId(
        updatedPortfolios.length > 0 ? updatedPortfolios[0].id : null
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPortfolioId,
        setCurrentPortfolioId,
        portfolios,
        setPortfolios,
        savePortfolioInLocalStorage,
        createNewPortfolioEmpty,
        createNewPortfolioExample,
        deletePortfolio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
