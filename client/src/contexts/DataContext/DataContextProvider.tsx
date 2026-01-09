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
    let lastValue = 0;

    dates.forEach((date, index) => {
      // Value
      const valueObj = values.find((v) => v.date_id === date.id);
      let value = 0;
      if (valueObj) {
        value = valueObj.value;
        lastValue = value;
      } else {
        value = lastValue;
      }

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

  // Helper to get all assets in a directory recursively
  const getAllAssetsInDirectory = (dirId: number): Asset[] => {
    if (!wallet) return [];
    if (dirId === 0) return wallet.assets;

    const assets = wallet.assets.filter((a) => a.dir_id === dirId);
    const subDirs = wallet.dirs.filter((d) => d.parent_dir_id === dirId);

    let allAssets = [...assets];
    subDirs.forEach((subDir) => {
      allAssets = [...allAssets, ...getAllAssetsInDirectory(subDir.id)];
    });

    return allAssets;
  };

  const getDirectoryPerformancePerDates = (
    dirId: number,
  ): Record<number, AssetPerformancePerDate> => {
    if (!wallet) return {};

    const assets = getAllAssetsInDirectory(dirId);

    const result: Record<number, AssetPerformancePerDate> = {};
    const dates = getSortedDates();

    // Initialize result with 0s
    dates.forEach((date) => {
      result[date.id] = {
        value: 0,
        deposits: 0,
        withdrawals: 0,
        fees: 0,
        rewards: 0,
        timeSpent: 0,
      };
    });

    // Sum up performance of each asset
    assets.forEach((asset) => {
      const assetPerf = getAssetPerformancePerDates(asset.id);
      Object.entries(assetPerf).forEach(([dateIdStr, perf]) => {
        const dateId = Number(dateIdStr);
        if (result[dateId]) {
          result[dateId].value += perf.value;
          result[dateId].deposits += perf.deposits;
          result[dateId].withdrawals += perf.withdrawals;
          result[dateId].fees += perf.fees;
          result[dateId].rewards += perf.rewards;
          // Time spent is the same for the date interval, don't sum it.
          // However, we need to set it once.
          // Actually, getAssetPerformancePerDates calculates timeSpent based on date diff.
          // So it should be the same for all assets for a given date.
          result[dateId].timeSpent = perf.timeSpent;
        }
      });
    });

    return result;
  };

  const getDirectoryPerformance = (dirId: number): AssetPerformance | null => {
    const perDates = getDirectoryPerformancePerDates(dirId);
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
        getDirectoryPerformance,
        getDirectoryPerformancePerDates,
        getAllAssetsInDirectory,
        getSortedDates,
        getSortedValues,
        getSortedTransactions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
