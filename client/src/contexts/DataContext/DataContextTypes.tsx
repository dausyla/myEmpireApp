import type {
  AssetPerformance,
  AssetPerformancePerDate,
} from "../../types/DataTypes";
import type {
  Asset,
  AssetValue,
  Transaction,
  WalletDate,
} from "@shared/WalletTypes";

export type DataContextType = {
  getAssetPerformance: (assetId: number) => AssetPerformance | null;
  getAssetPerformancePerDates: (
    assetId: number,
  ) => Record<number, AssetPerformancePerDate>;
  getSortedDates: () => WalletDate[];
  getSortedValues: (asset: Asset) => AssetValue[];
  getSortedTransactions: (asset: Asset) => Transaction[];
};
