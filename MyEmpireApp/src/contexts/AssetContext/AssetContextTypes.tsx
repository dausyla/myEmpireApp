import type { Asset, Directory } from "../../types/PortfolioTypes";

export type AssetContextType = {
  currentAsset: Asset | undefined;
  setCurrentAsset: (asset: Asset | undefined) => void;

  getAsset: (assetId: number) => Asset | undefined;
  addNewAsset: ({
    name,
    fromDir,
  }: {
    name?: string;
    fromDir?: Directory;
  }) => void;
  deleteAsset: (asset: Asset) => void;
  mapAssets: (fn: (asset: Asset) => void, fromDir?: Directory) => void;

  getDir: (dirId: number) => Directory | undefined;
  addNewDir: ({
    name,
    fromDir,
  }: {
    name?: string;
    fromDir?: Directory;
  }) => void;
  deleteDir: (dir: Directory) => void;
};
