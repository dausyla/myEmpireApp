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
  dir_id: number;
  name: string;
  color: string; // hex
  estimated_apy: number | null;
  count_first_input: boolean;
  created_at: string;
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

// Optional: Full nested response from API
export type WalletResponse = {
  wallet: Wallet;
  dates: WalletDate[];
  dirs: Directory[];
  assets: (Asset & {
    values: AssetValue[];
    transactions: Transaction[];
  })[];
};
