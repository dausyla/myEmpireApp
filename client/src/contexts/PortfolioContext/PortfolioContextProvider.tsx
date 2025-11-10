import { useEffect, useState, type ReactNode } from "react";
import type { Portfolio, PortfolioList } from "../../types/PortfolioTypes";
import { PortfolioContext } from "./PortfolioContextHook";
import { useAuthContext } from "../AuthContext/AuthContextHook";
import { api } from "../../utilies/api/api";
import { ENDPOINTS } from "../../utilies/api/endpoints";
import toast from "react-hot-toast";

export const PortofolioContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [portfolioList, setPortfolioList] = useState<PortfolioList>([]);

  const createPortfolio = (title: string, description?: string) => {
    if (!user?.premium && portfolio) {
      toast.error(
        "You already have a portfolio, upgrade your account to be able to have other ones",
      );
    }

    if (!description) description = "My wallet description.";

    api<Portfolio>(ENDPOINTS.WALLETS.CREATE, "POST", {
      title,
      description,
    }).then(setPortfolio);
  };

  const getPortfolioTitles = () => {
    api<PortfolioList>(ENDPOINTS.WALLETS.LIST, "GET").then(setPortfolioList);
  };

  const getPortfolio = (walletId: number) => {
    api<Portfolio>(ENDPOINTS.WALLETS.GET(`${walletId}`), "GET").then(
      setPortfolio,
    );
  };

  const modifyPortfolio = () => {
    // TODO later
  };

  // When app starts, fetch the user portfolios
  useEffect(() => {
    getPortfolioTitles();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        portfolioList,
        createPortfolio,
        getPortfolio,
        getPortfolioTitles,
        modifyPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
