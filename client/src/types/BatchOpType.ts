import type {
  Asset,
  AssetValue,
  Directory,
  RecurringTransaction,
  Transaction,
  WalletDate,
} from "./WalletTypes";

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
