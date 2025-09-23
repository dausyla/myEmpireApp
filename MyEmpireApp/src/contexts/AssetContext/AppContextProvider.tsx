import { useEffect, useState, type ReactNode } from "react";
import { AssetContext } from "./AssetContextHook";
import { usePortfolio } from "../PortfolioContext/PortfolioContextHook";

export const AssetContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentAssetId, setCurrentAsset] = useState<number | null>(null);

  const { portfolio } = usePortfolio();

  useEffect(() => {
    if (portfolio && portfolio.assets.length > 0 && currentAssetId === null) {
      setCurrentAsset(portfolio.assets[0].id);
    }
  }, [portfolio, currentAssetId]);

  return (
    <AssetContext.Provider
      value={{
        currentAssetId,
        setCurrentAsset,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
