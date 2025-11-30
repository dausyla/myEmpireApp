import type { ReactNode } from "react";
import { DataContext } from "./DataContextHook";
import { useWallet } from "../WalletContext/WalletContextHook";
import type {
  AssetPerformance,
  AssetPerformancePerDate,
} from "../../types/DataTypes";
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

  const getAssetPerformancePerDates = (
    assetId: number,
  ): Record<number, AssetPerformancePerDate> => {
    if (!wallet) return {};
    const asset = wallet.assets.find((a) => a.id === assetId);
    if (!asset) return {};

    const dates = getSortedDates();
    const values = getSortedValues(asset);
    const transactions = getSortedTransactions(asset);

    const result: Record<number, AssetPerformancePerDate> = {};

    dates.forEach((date, index) => {
      // Value
      const valueObj = values.find((v) => v.date_id === date.id);
      const value = valueObj ? valueObj.value : 0;

      // Transactions for this date
      const dateTransactions = transactions.filter(
        (t) => t.date_id === date.id,
      );

      const deposits = dateTransactions.reduce((sum, t) => {
        if (t.type === "deposit" && t.to_asset_id === asset.id)
          return sum + t.amount;
        if (t.type === "withdrawal" && t.to_asset_id === asset.id)
          return sum + t.amount;
        return sum;
      }, 0);

      const withdrawals = dateTransactions.reduce((sum, t) => {
        if (t.type === "deposit" && t.from_asset_id === asset.id)
          return sum + t.amount;
        if (t.type === "withdrawal" && t.from_asset_id === asset.id)
          return sum + t.amount;
        return sum;
      }, 0);

      const fees = dateTransactions.reduce((sum, t) => {
        if (t.type === "fee" && t.to_asset_id === asset.id)
          return sum + t.amount;
        return sum;
      }, 0);

      const rewards = dateTransactions.reduce((sum, t) => {
        if (t.type === "reward" && t.from_asset_id === asset.id)
          return sum + t.amount;
        return sum;
      }, 0);

      // Time Spent
      let timeSpent = 0;
      if (index > 0) {
        const prevDate = dates[index - 1];
        timeSpent =
          (new Date(date.date).getTime() - new Date(prevDate.date).getTime()) /
          (1000 * 3600 * 24);
      }

      result[date.id] = {
        value,
        deposits,
        withdrawals,
        fees,
        rewards,
        timeSpent,
      };
    });

    return result;
  };

  const getAssetPerformance = (assetId: number): AssetPerformance | null => {
    const perDates = getAssetPerformancePerDates(assetId);
    const dateIds = Object.keys(perDates).map(Number);
    if (dateIds.length === 0) return null;

    let totalDeposit = 0;
    let totalWithdrawal = 0;
    let totalFees = 0;
    let totalRewards = 0;
    let timeSpent = 0;

    Object.values(perDates).forEach((d) => {
      totalDeposit += d.deposits;
      totalWithdrawal += d.withdrawals;
      totalFees += d.fees;
      totalRewards += d.rewards;
      timeSpent += d.timeSpent;
    });

    // Get last value
    const lastDateId = Math.max(...dateIds);
    const totalValue = perDates[lastDateId].value;

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
        getAssetPerformancePerDates,
        getSortedDates,
        getSortedValues,
        getSortedTransactions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
