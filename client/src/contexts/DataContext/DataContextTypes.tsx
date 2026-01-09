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
  getDirectoryPerformance: (dirId: number) => AssetPerformance | null;
  getDirectoryPerformancePerDates: (
    dirId: number,
  ) => Record<number, AssetPerformancePerDate>;
  getAllAssetsInDirectory: (dirId: number) => Asset[];
  getSortedDates: () => WalletDate[];
  getSortedValues: (asset: Asset) => AssetValue[];
  getSortedTransactions: (asset: Asset) => Transaction[];
};
