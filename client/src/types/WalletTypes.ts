// Data structure used in Frontend & Backend

export type Wallet = {
  id: number;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type WalletDate = {
  id: number;
  wallet_id: number;
  date: string; // ISO date
  index: number;
  created_at: string;
};

export type Directory = {
  id: number;
  wallet_id: number;
  name: string;
  description: string | null;
  parent_dir_id: number | null;
  created_at: string;
};

export type Asset = {
  id: number;
  dir_id: number | null;
  name: string;
  color: string; // hex
  estimated_apy: number | null;
  count_first_input: boolean;
  created_at: string;
  // Added when building the response
  values: AssetValue[];
  transactions: Transaction[];
  recurring_transactions: RecurringTransaction[];
};

export type AssetValue = {
  id: number;
  asset_id: number;
  date_id: number;
  value: number;
};

export type Transaction = {
  id: number;
  asset_id: number;
  date_id: number;
  amount: number;
  type: "deposit" | "withdrawal" | "fee" | "reward";
  created_at: string;
};

export type RecurringTransaction = {
  id: number;
  asset_id: number;
  amount: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  created_at: string;
};

export type WalletResponse = {
  wallet: Wallet;
  dates: WalletDate[];
  dirs: Directory[];
  assets: Asset[];
};

export type WalletList = {
  id: number;
  title: string;
  description: string;
}[];

// A batch response is all the inserted new rows
// Like this, we can fetch their ids and fix the tempId of the optimistic UI
export type BatchResponse = (
  | RecurringTransaction
  | Asset
  | Directory
  | AssetValue
  | WalletDate
  | Transaction
)[];
