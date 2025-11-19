import type { AssetPerformance } from "../../types/DataTypes";
import type { Asset, AssetValue, WalletDate } from "../../types/WalletTypes";

export type DataContextType = {
  getAssetPerformance: (assetId: number) => AssetPerformance | null;
  getSortedDates: () => WalletDate[];
  getSortedValues: (asset: Asset) => AssetValue[];
};
