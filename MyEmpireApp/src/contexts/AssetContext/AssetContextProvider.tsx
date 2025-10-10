import { useState, type ReactNode } from "react";
import { AssetContext } from "./AssetContextHook";
import { usePortfolio } from "../PortfolioContext/PortfolioContextHook";
import type { Asset, Directory } from "../../types/PortfolioTypes";

export const AssetContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentAsset, setCurrentAsset] = useState<Asset | undefined>(
    undefined
  );
  const { portfolio, modifyPortfolio } = usePortfolio();

  const getDirRec: (
    dirId: number,
    current: Directory
  ) => Directory | undefined = (dirId: number, current: Directory) => {
    if (current.id === dirId) return current;
    for (let i = 0; i < current.subDirs.length; i++) {
      const d = getDirRec(dirId, current.subDirs[i]);
      if (d) return d;
    }
    return undefined;
  };
  const getDir = (dirId: number) => {
    if (!portfolio) return undefined;
    return getDirRec(dirId, portfolio.root);
  };
  const getAssetRec: (
    assetId: number,
    current: Directory
  ) => Asset | undefined = (assetId: number, current: Directory) => {
    const asset = current.subAssets.find((a) => a.id === assetId);
    if (asset) return asset;
    for (let i = 0; i < current.subDirs.length; i++) {
      const a = getAssetRec(assetId, current.subDirs[i]);
      if (a) return a;
    }
    return undefined;
  };
  const addNewDir = (name: string = "New Directory", dirId: number = 1) => {
    if (!portfolio) return;
    const dir = getDir(dirId);
    if (!dir) return;
    const newDirId = portfolio.dirNumber + 1;
    dir.subDirs.push({
      id: newDirId,
      name: name,
      isOpened: true,
      subDirs: [],
      subAssets: [],
      parentDirId: dir.id,
    });
    portfolio.dirNumber += 1;
    modifyPortfolio(portfolio);
  };
  const deleteDir = (dirId: number) => {
    if (!portfolio) return;
    if (dirId === 0) return; // Root
    const dir = getDir(dirId);
    if (!dir) return;
    const parentDir = getDir(dir.parentDirId);
    if (!parentDir) return;

    dir.subDirs = dir.subDirs.filter((d) => d.id !== dirId);
    portfolio.dirNumber -= 1;
  };

  const getAsset = (assetId: number) => {
    if (!portfolio) return undefined;
    return getAssetRec(assetId, portfolio.root);
  };
  const addNewAsset = (name: string = "New Asset", dirId: number = 0) => {
    if (!portfolio) return;
    const dir = getDir(dirId);
    if (!dir) return;
    const newAssetId = portfolio.assetNumber + 1;
    dir.subAssets.push({
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
      parentDirID: dirId,
    });
    portfolio.assetNumber += 1;
    modifyPortfolio(portfolio);
    setCurrentAsset(dir.subAssets[-1]); // Set the new asset as the current
  };
  const deleteAsset = (assetId: number) => {
    if (!portfolio) return;
    const asset = getAsset(assetId);
    if (!asset) return;
    const dir = getDir(asset?.parentDirID);
    if (!dir) return;

    dir.subAssets = dir.subAssets.filter((a) => a.id !== assetId);
    portfolio.assetNumber -= 1;

    if (currentAsset == asset) {
      setCurrentAsset(undefined);
    }

    modifyPortfolio(portfolio);
  };
  const mapAssets = (fn: (a: Asset) => void, fromDir?: Directory) => {
    if (!portfolio) return;
    if (!fromDir) fromDir = portfolio.root;
    fromDir.subAssets.forEach((a) => fn(a));
    fromDir.subDirs.forEach((d) => mapAssets(fn, d));
  };

  return (
    <AssetContext.Provider
      value={{
        currentAsset,
        setCurrentAsset,

        getAsset,
        addNewAsset,
        deleteAsset,
        mapAssets,

        getDir,
        addNewDir,
        deleteDir,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

const random255 = () => {
  return Math.floor(Math.random() * 255);
};
