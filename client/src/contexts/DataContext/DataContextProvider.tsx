import type { ReactNode } from "react";
import { DataContext } from "./DataContextHook";
import { useWallet } from "../WalletContext/WalletContextHook";
import type { AssetPerformance } from "../../types/DataTypes";
import type { Asset } from "@shared/WalletTypes";

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const { wallet } = useWallet();

  const getSortedDates = () => {
    if (!wallet) return [];
    return [...wallet.dates].sort((a, b) => a.date.localeCompare(b.date));
  };

  const getSortedValues = (asset: Asset) => {
    const dateIdToIndex = Object.fromEntries(
      getSortedDates().map((d, i) => [d.id, i]),
    );

    return [...asset.values].sort((a, b) => {
      const indexA = dateIdToIndex[a.date_id] ?? -1;
      const indexB = dateIdToIndex[b.date_id] ?? -1;
      return indexA - indexB;
    });
  };

  const getSortedTransactions = (asset: Asset) => {
    if (!wallet) return [];

    const dateIdToIndex = Object.fromEntries(
      getSortedDates().map((d, i) => [d.id, i]),
    );

    const transactions = wallet.transactions
      .filter((t) => t.to_asset_id === asset.id || t.from_asset_id === asset.id)
      .sort((a, b) => {
        const indexA = dateIdToIndex[a.date_id] ?? -1;
        const indexB = dateIdToIndex[b.date_id] ?? -1;
        return indexA - indexB;
      });

    return transactions;
  };

  // Helpers
  const round = (n: number, decimals = 2) =>
    Math.round(n * 10 ** decimals) / 10 ** decimals;

  const getAssetPerformance = (assetId: number): AssetPerformance | null => {
    if (!wallet) return null;
    const asset = wallet.assets.find((a) => a.id === assetId);
    if (!asset) return null;

    const dates = getSortedDates();
    const values = getSortedValues(asset);
    const transactions = getSortedTransactions(asset);

    if (values.length === 0) return null;

    // --- Data ---
    const totalValue = values[values.length - 1].value;

    const firstDate = dates.find((d) => d.id === values[0].date_id);
    const lastDate = dates.find(
      (d) => d.id === values[values.length - 1].date_id,
    );
    if (!firstDate || !lastDate) return null;

    const timeSpent =
      (new Date(lastDate.date).getTime() - new Date(firstDate.date).getTime()) /
      (1000 * 3600 * 24); // days

    // --- Transactions ---
    // Deposit = Deposit to + Withdrawal to
    const totalDeposit = transactions.reduce((sum, t) => {
      if (t.type === "deposit" && t.to_asset_id === asset.id)
        return sum + t.amount;
      else if (t.type === "withdrawal" && t.to_asset_id === asset.id)
        return sum + t.amount;
      return sum;
    }, 0);
    // Deposit = Deposit from + Withdrawal from
    const totalWithdrawal = transactions.reduce((sum, t) => {
      if (t.type === "deposit" && t.from_asset_id === asset.id)
        return sum + t.amount;
      else if (t.type === "withdrawal" && t.from_asset_id === asset.id)
        return sum + t.amount;
      return sum;
    }, 0);
    // Fee = Fees to
    const totalFees = transactions.reduce((sum, t) => {
      if (t.type === "fee" && t.to_asset_id === asset.id) return sum + t.amount;
      return sum;
    }, 0);
    // Rewards = Rewards from
    const totalRewards = transactions.reduce((sum, t) => {
      if (t.type === "reward" && t.from_asset_id === asset.id)
        return sum + t.amount;
      return sum;
    }, 0);

    // --- Performance ---
    const netInvested =
      totalDeposit - totalWithdrawal - totalFees + totalRewards;
    const totalInterests = totalValue - netInvested;
    const totalGrowth =
      netInvested > 0 ? (totalInterests / netInvested) * 100 : 0;
    const apy =
      timeSpent > 0
        ? ((totalValue / netInvested) ** (365 / timeSpent) - 1) * 100
        : 0;

    return {
      totalValue,
      timeSpent: Math.round(timeSpent),
      totalDeposit,
      totalWithdrawal,
      totalFees,
      totalRewards,
      totalInterests,
      totalGrowth: round(totalGrowth),
      apy: isFinite(apy) ? round(apy) : 0,
    };
  };

  return (
    <DataContext.Provider
      value={{
        getAssetPerformance,
        getSortedDates,
        getSortedValues,
        getSortedTransactions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
