export type AssetPerformance = {
  // Data
  totalValue: number;
  timeSpent: number; // days?
  // Transactions
  totalDeposit: number;
  totalWithdrawal: number;
  totalFees: number;
  totalRewards: number;
  // Performence
  totalInterests: number;
  totalGrowth: number; // %
  apy: number; // %
};

export type AssetPerformancePerDate = {
  value: number;
  deposits: number;
  withdrawals: number;
  fees: number;
  rewards: number;
  timeSpent: number; // days since last date
};
