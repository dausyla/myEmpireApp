import { useState, type ReactNode } from "react";
import { AssetContext } from "./AssetContextHook";
import { usePortfolio } from "../WalletContext/WalletContextHook";
import type { Asset, Directory } from "../../types/WalletTypes";

export const AssetContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentAsset, setCurrentAsset] = useState<Asset | undefined>(
    undefined,
  );
  const { portfolio, modifyPortfolio } = usePortfolio();

  /*  ############
      #   DIRS   #
      ############ */

  const getDirRec: (
    dirId: number,
    current: Directory,
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
  const addNewDir = ({
    name = "New Directory",
    fromDir,
  }: {
    name?: string;
    fromDir?: Directory;
  }) => {
    if (!portfolio) return;
    if (!fromDir) fromDir = portfolio.root;
    fromDir.isOpened = true;
    const newDirId = portfolio.dirNumber + 1;
    fromDir.subDirs.push({
      id: newDirId,
      name: name,
      isOpened: true,
      subDirs: [],
      subAssets: [],
      parentDirId: fromDir.id,
    });
    portfolio.dirNumber += 1;
    modifyPortfolio(portfolio);
  };
  const deleteDirRec = (dir: Directory, parentDir: Directory) => {
    dir.subAssets.forEach((a) => deleteAsset(a));
    dir.subDirs.forEach((d) => deleteDirRec(d, dir));
    parentDir.subDirs = parentDir.subDirs.filter((d) => d.id !== dir.id);
    if (portfolio) portfolio.dirNumber -= 1;
  };
  const deleteDir = (dir: Directory) => {
    if (!portfolio) return;
    if (dir.id === 0) return; // Root
    const parentDir = getDir(dir.parentDirId);
    console.log(parentDir);
    if (!parentDir) return;
    deleteDirRec(dir, parentDir);
    modifyPortfolio(portfolio);
  };

  /*  ##############
      #   ASSETS   #
      ############## */
  const getAssetRec: (
    assetId: number,
    current: Directory,
  ) => Asset | undefined = (assetId: number, current: Directory) => {
    const asset = current.subAssets.find((a) => a.id === assetId);
    if (asset) return asset;
    for (let i = 0; i < current.subDirs.length; i++) {
      const a = getAssetRec(assetId, current.subDirs[i]);
      if (a) return a;
    }
    return undefined;
  };
  const getAsset = (assetId: number) => {
    if (!portfolio) return undefined;
    return getAssetRec(assetId, portfolio.root);
  };
  const addNewAsset = ({
    name = "New Asset",
    fromDir,
  }: {
    name?: string;
    fromDir?: Directory;
  }) => {
    if (!portfolio) return;
    if (!fromDir) fromDir = portfolio.root;
    fromDir.isOpened = true;
    const newAssetId = portfolio.assetNumber + 1;
    fromDir.subAssets.push({
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
      parentDirID: fromDir.id,
    });
    portfolio.assetNumber += 1;
    modifyPortfolio(portfolio);
    setCurrentAsset(fromDir.subAssets[-1]); // Set the new asset as the current
  };
  const deleteAsset = (asset: Asset) => {
    if (!portfolio) return;
    const dir = getDir(asset.parentDirID);
    if (!dir) return;

    dir.subAssets = dir.subAssets.filter((a) => a.id !== asset.id);
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
