import type { AssetPerformance } from "../../types/DataTypes";
import type {
  Asset,
  AssetValue,
  Transaction,
  WalletDate,
} from "@shared/WalletTypes";

export type DataContextType = {
  getAssetPerformance: (assetId: number) => AssetPerformance | null;
  getSortedDates: () => WalletDate[];
  getSortedValues: (asset: Asset) => AssetValue[];
  getSortedTransactions: (asset: Asset) => Transaction[];
};
