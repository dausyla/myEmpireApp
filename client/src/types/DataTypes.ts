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
