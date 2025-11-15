import type { AssetPerformance } from "../../types/DataTypes";

export type DataContextType = {
  getAssetPerformance: (assetId: number) => AssetPerformance | null;
};
