import { useEffect, useState, type ReactNode } from "react";
import { AssetContext } from "./AssetContextHook";
import { usePortfolio } from "../PortfolioContext/PortfolioContextHook";

export const AssetContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentAssetId, setCurrentAsset] = useState<number | null>(null);

  const { portfolio, modifyPortfolio } = usePortfolio();

  useEffect(() => {
    if (portfolio && portfolio.assets.length > 0 && currentAssetId === null) {
      setCurrentAsset(portfolio.assets[0].id);
    }
  }, [portfolio, currentAssetId]);

  const addNewAsset = (name: string = "New Asset") => {
    if (!portfolio) return;
    const maxAssetId = portfolio.assets.reduce(
      (maxId, asset) => (asset.id > maxId ? asset.id : maxId),
      0
    );
    const newAssetId = maxAssetId + 1; // Simple ID generation
    portfolio.assets.push({
      id: newAssetId,
      name: name,
      values: portfolio.dates.map(() => 0), // Initialize with zeros
      inputs: portfolio.dates.map(() => 0), // Initialize with zeros
      prediction: {
        estimatedAPY: 0,
        monthlyInput: 0,
      },
      color: {
        r: random255(),
        g: random255(),
        b: random255(),
      },
    });
    modifyPortfolio(portfolio);
    setCurrentAsset(newAssetId); // Set the new asset as the current
  };

  const deleteAsset = (assetId: number) => {
    if (!portfolio) return;
    const assetIndex = portfolio.assets.findIndex(
      (asset) => asset.id === assetId
    );
    if (assetIndex === -1) return; // Asset not found

    portfolio.assets.splice(assetIndex, 1);
    modifyPortfolio(portfolio);

    // If the deleted asset was the current one, reset currentAssetId
    if (currentAssetId === assetId) {
      setCurrentAsset(
        portfolio.assets.length > 0 ? portfolio.assets[0].id : null
      );
    }
  };

  return (
    <AssetContext.Provider
      value={{
        currentAssetId,
        setCurrentAsset,
        addNewAsset,
        deleteAsset,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

const random255 = () => {
  return Math.floor(Math.random() * 255);
};
