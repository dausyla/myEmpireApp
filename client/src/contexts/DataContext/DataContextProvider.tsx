import type { ReactNode } from "react";
import { DataContext } from "./DataContextHook";
import { useWallet } from "../WalletContext/WalletContextHook";
import type { AssetPerformance } from "../../types/DataTypes";
import type { Asset, Transaction } from "../../types/WalletTypes";

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

  // Helpers
  const sumTx = (txs: Transaction[], type: Transaction["type"]) =>
    txs.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
  const round = (n: number, decimals = 2) =>
    Math.round(n * 10 ** decimals) / 10 ** decimals;

  const getAssetPerformance = (assetId: number): AssetPerformance | null => {
    if (!wallet) return null;
    const asset = wallet.assets.find((a) => a.id === assetId);
    if (!asset) return null;

    // Sort the data by dates
    const dates = getSortedDates();
    const values = asset.values.sort((a, b) => a.date_id - b.date_id);
    const transactions = asset.transactions.sort(
      (a, b) => a.date_id - b.date_id,
    );

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
    const totalDeposit = sumTx(transactions, "deposit");
    const totalWithdrawal = sumTx(transactions, "withdrawal");
    const totalFees = sumTx(transactions, "fee");
    const totalRewards = sumTx(transactions, "reward");

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
      value={{ getAssetPerformance, getSortedDates, getSortedValues }}
    >
      {children}
    </DataContext.Provider>
  );
};
