import type { BatchOp } from "@shared/BatchOpType";
import type {
  Asset,
  AssetValue,
  Directory,
  RecurringTransaction,
  Transaction,
  WalletDate,
} from "@shared/WalletTypes";

export type BatchContextType = {
  queue: BatchOp[];
  isFlushing: boolean;
  resolvedIds: Record<number, number>;
  flush: () => Promise<void>;

  // Transactions
  addTransaction: (tx: Omit<Transaction, "id" | "created_at">) => void;
  updateTransaction: (id: number, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;

  // Asset Values
  addAssetValue: (value: Omit<AssetValue, "id" | "created_at">) => void;
  updateAssetValue: (id: number, updates: Partial<AssetValue>) => void;
  deleteAssetValue: (id: number) => void;

  // Dates
  addDate: (date: Omit<WalletDate, "id" | "created_at">) => void;
  updateDate: (id: number, updates: Partial<WalletDate>) => void;
  deleteDate: (id: number) => void;

  // Assets
  addAsset: (
    asset: Omit<
      Asset,
      "id" | "created_at" | "recurring_transactions" | "transactions" | "values"
    >,
  ) => void;
  updateAsset: (id: number, updates: Partial<Asset>) => void;
  deleteAsset: (id: number) => void;

  // Dirs
  addDir: (dir: Omit<Directory, "id" | "created_at">) => void;
  updateDir: (id: number, updates: Partial<Directory>) => void;
  deleteDir: (id: number) => void;

  // Recurring Transactions
  addRecurring: (rt: Omit<RecurringTransaction, "id" | "created_at">) => void;
  updateRecurring: (id: number, updates: Partial<RecurringTransaction>) => void;
  deleteRecurring: (id: number) => void;
};
