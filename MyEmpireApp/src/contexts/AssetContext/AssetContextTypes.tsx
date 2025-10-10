import type { Asset, Directory } from "../../types/PortfolioTypes";

export type AssetContextType = {
  currentAsset: Asset | undefined;
  setCurrentAsset: (asset: Asset | undefined) => void;

  getAsset: (assetId: number) => Asset | undefined;
  addNewAsset: (name?: string, dirId?: number) => void;
  deleteAsset: (assetId: number) => void;
  mapAssets: (fn: (asset: Asset) => void, fromDir?: Directory) => void;

  getDir: (dirId: number) => Directory | undefined;
  addNewDir: (name?: string, dirId?: number) => void;
  deleteDir: (dirId: number) => void;
};
