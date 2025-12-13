import { useState, useMemo, useEffect } from "react";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { AssetValueChart } from "./AssetValueChart";

export function AssetValuePrediction() {
  const { wallet } = useWallet();
  const { getAssetPerformance, getAssetPerformancePerDates, getSortedDates } =
    useData();
  const { currentItem } = useApp();
  const [years, setYears] = useState(10);
  const [selectedAssetId, setSelectedAssetId] = useState<number | "all">(() => {
    if (currentItem?.type === "asset") {
      return currentItem.id;
    }
    return "all";
  });

  useEffect(() => {
    if (currentItem?.type === "asset") {
      setSelectedAssetId(currentItem.id);
    } else {
      setSelectedAssetId("all");
    }
  }, [currentItem]);

  if (!wallet) return null;

  const chartData = useMemo(() => {
    const sortedDates = getSortedDates();
    const historicalLabels = sortedDates.map((d) => d.date);
    const futureLabels = Array.from(
      { length: years },
      (_, i) => `Year ${i + 1}`,
    );
    const labels = [...historicalLabels, ...futureLabels];

    let currentTotalValue = 0;
    let monthlyContribution = 0;
    let weightedApy = 0;

    const assetsToConsider =
      selectedAssetId === "all"
        ? wallet.assets
        : wallet.assets.filter((a) => a.id === selectedAssetId);

    // --- Historical Data Calculation ---
    const historicalDataMap: Record<number, number> = {};
    sortedDates.forEach((d) => (historicalDataMap[d.id] = 0));

    assetsToConsider.forEach((asset) => {
      const perfPerDate = getAssetPerformancePerDates(asset.id);
      Object.entries(perfPerDate).forEach(([dateId, perf]) => {
        if (historicalDataMap[Number(dateId)] !== undefined) {
          historicalDataMap[Number(dateId)] += perf.value;
        }
      });
    });

    const historicalValues = sortedDates.map((d) => historicalDataMap[d.id]);

    // --- Prediction Calculation ---
    // Calculate initial state for prediction (based on current latest values)
    assetsToConsider.forEach((asset) => {
      const perf = getAssetPerformance(asset.id);
      if (perf) {
        currentTotalValue += perf.totalValue;
        weightedApy += (asset.estimated_apy || 0) * perf.totalValue;
      }
    });

    if (currentTotalValue > 0) {
      weightedApy = weightedApy / currentTotalValue;
    } else {
      const totalApy = assetsToConsider.reduce(
        (sum, a) => sum + (a.estimated_apy || 0),
        0,
      );
      weightedApy = assetsToConsider.length
        ? totalApy / assetsToConsider.length
        : 0;
    }

    // Calculate monthly recurring contributions
    wallet.recurring_transactions.forEach((t) => {
      let amount = t.amount;
      if (t.type === "withdrawal" || t.type === "fee") amount = -amount;

      if (selectedAssetId !== "all") {
        if (
          t.to_asset_id !== selectedAssetId &&
          t.from_asset_id !== selectedAssetId
        )
          return;
        if (t.to_asset_id === selectedAssetId) {
          // deposit
        } else if (t.from_asset_id === selectedAssetId) {
          amount = -Math.abs(amount);
        }
      }

      switch (t.period) {
        case "daily":
          monthlyContribution += amount * 30;
          break;
        case "weekly":
          monthlyContribution += amount * 4;
          break;
        case "monthly":
          monthlyContribution += amount;
          break;
        case "yearly":
          monthlyContribution += amount / 12;
          break;
      }
    });

    const predictionValues = [];
    // The first point of prediction should connect to the last point of history
    // But chart.js handles gaps if we use nulls, or we can just pad the array.
    // Better approach:
    // Historical dataset: [v1, v2, v3, null, null]
    // Prediction dataset: [null, null, v3, v4, v5]

    // Let's pad prediction with nulls for historical part
    const predictionPadding = Array(historicalValues.length - 1).fill(null);
    // Start prediction from last historical value
    const lastHistoricalValue =
      historicalValues[historicalValues.length - 1] || 0;
    predictionValues.push(...predictionPadding, lastHistoricalValue);

    let runningValue = lastHistoricalValue;

    for (let i = 1; i <= years; i++) {
      runningValue += monthlyContribution * 12;
      runningValue *= 1 + weightedApy / 100;
      predictionValues.push(runningValue);
    }

    return {
      labels,
      historicalData: historicalValues,
      predictionData: predictionValues,
    };
  }, [
    wallet,
    years,
    selectedAssetId,
    getAssetPerformance,
    getAssetPerformancePerDates,
    getSortedDates,
  ]);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h5 className="mb-0 font-bold text-lg text-[var(--text-primary)] whitespace-nowrap">
          Predictions
        </h5>

        <div className="flex gap-2 items-center">
          <select
            value={selectedAssetId}
            onChange={(e) =>
              setSelectedAssetId(
                e.target.value === "all" ? "all" : parseInt(e.target.value),
              )
            }
            className="input"
          >
            <option value="all">All Assets</option>
            {wallet.assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--text-primary)]">Years:</label>
            <input
              type="number"
              min="0"
              max="99"
              value={years}
              onChange={(e) =>
                setYears(
                  Math.min(99, Math.max(0, parseInt(e.target.value) || 0)),
                )
              }
              className="input w-20"
            />
          </div>
        </div>
      </div>

      <div className="flex-grow relative min-h-0">
        <AssetValueChart
          historicalData={chartData.historicalData}
          predictionData={chartData.predictionData}
          labels={chartData.labels}
        />
      </div>
      <div className="mt-4 text-xs text-[var(--text-secondary)]">
        * Prediction assumes constant APY and recurring transactions.
      </div>
    </div>
  );
}
