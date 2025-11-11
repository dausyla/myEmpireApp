import type {
  Asset,
  AssetValue,
  Directory,
  RecurringTransaction,
  Transaction,
  WalletDate,
} from "../../types/WalletTypes";

export type BatchOp =
  // === Transactions ===
  | {
      op: "insert";
      table: "transactions";
      data: Omit<Transaction, "id" | "created_at">;
      tempId?: number;
    }
  | {
      op: "update";
      table: "transactions";
      id: number;
      data: Partial<Transaction>;
    }
  | { op: "delete"; table: "transactions"; id: number; tempId?: number }
  // === Asset Values ===
  | {
      op: "update";
      table: "asset_values";
      id: number;
      data: Partial<AssetValue>;
    }
  // === Dates ===
  | {
      op: "insert";
      table: "wallet_dates";
      data: Omit<WalletDate, "id" | "created_at">;
      tempId?: number;
    }
  | {
      op: "update";
      table: "wallet_dates";
      id: number;
      data: Partial<WalletDate>;
    }
  | { op: "delete"; table: "wallet_dates"; id: number; tempId?: number }
  // === Assets ===
  | {
      op: "insert";
      table: "assets";
      data: Omit<Asset, "id" | "created_at">;
      tempId?: number;
    }
  | {
      op: "update";
      table: "assets";
      id: number;
      data: Partial<Asset>;
    }
  | { op: "delete"; table: "assets"; id: number; tempId?: number }
  // === Dirs ===
  | {
      op: "insert";
      table: "dirs";
      data: Omit<Directory, "id" | "created_at">;
      tempId?: number;
    }
  | {
      op: "update";
      table: "dirs";
      id: number;
      data: Partial<Directory>;
    }
  | { op: "delete"; table: "dirs"; id: number; tempId?: number }
  // === Recurring Transactions ===
  | {
      op: "insert";
      table: "recurring_transactions";
      data: Omit<RecurringTransaction, "id" | "created_at">;
      tempId?: number;
    }
  | {
      op: "update";
      table: "recurring_transactions";
      id: number;
      data: Partial<RecurringTransaction>;
    }
  | {
      op: "delete";
      table: "recurring_transactions";
      id: number;
      tempId?: number;
    };

export type BatchContextType = {
  queue: BatchOp[];
  flush: () => Promise<void>;

  // Transactions
  addTransaction: (tx: Omit<Transaction, "id" | "created_at">) => void;
  updateTransaction: (id: number, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;

  // Asset Values
  updateAssetValue: (id: number, updates: Partial<AssetValue>) => void;

  // Dates
  addDate: (date: Omit<WalletDate, "id" | "created_at">) => void;
  updateDate: (id: number, updates: Partial<WalletDate>) => void;
  deleteDate: (id: number) => void;

  // Assets
  addAsset: (asset: Omit<Asset, "id" | "created_at">) => void;
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
