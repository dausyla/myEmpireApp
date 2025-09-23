export type AssetContextType = {
  currentAssetId: number | null;
  setCurrentAsset: (assetId: number | null) => void;
  addNewAsset: (name?: string) => void;
  deleteAsset: (assetId: number) => void;
};
