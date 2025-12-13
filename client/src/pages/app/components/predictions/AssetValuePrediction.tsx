import { useState, useMemo, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export function AssetValuePrediction() {
  const { wallet } = useWallet();
  const { getAssetPerformance } = useData();
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

  const predictions = useMemo(() => {
    const labels = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);

    let currentTotalValue = 0;
    let monthlyContribution = 0;
    let weightedApy = 0;

    const assetsToConsider =
      selectedAssetId === "all"
        ? wallet.assets
        : wallet.assets.filter((a) => a.id === selectedAssetId);

    // Calculate initial state
    assetsToConsider.forEach((asset) => {
      const perf = getAssetPerformance(asset.id);
      if (perf) {
        currentTotalValue += perf.totalValue;
        // Weighted APY calculation could be more complex, simplified here
        // Assuming average APY for simplicity or 0 if not set
        weightedApy += (asset.estimated_apy || 0) * perf.totalValue;
      }
    });

    if (currentTotalValue > 0) {
      weightedApy = weightedApy / currentTotalValue;
    } else {
      // Fallback if no value, average of APYs
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

      // Filter by asset if selected
      if (selectedAssetId !== "all") {
        if (
          t.to_asset_id !== selectedAssetId &&
          t.from_asset_id !== selectedAssetId
        )
          return;
        // Logic for asset specific flow could be complex, simplifying to:
        // If it goes to this asset, add. If it comes from this asset, subtract.
        if (t.to_asset_id === selectedAssetId) {
          // deposit to this asset
        } else if (t.from_asset_id === selectedAssetId) {
          amount = -Math.abs(amount); // Ensure it's negative
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

    const dataPoints = [currentTotalValue];
    let runningValue = currentTotalValue;

    for (let i = 1; i <= years; i++) {
      // Add yearly contribution (simplified compound interest calculation)
      // FV = PV * (1 + r)^n + PMT * ...
      // Doing iterative for clarity

      // Add contributions for the year
      runningValue += monthlyContribution * 12;

      // Apply interest
      runningValue *= 1 + weightedApy / 100;

      dataPoints.push(runningValue);
    }

    return {
      labels,
      datasets: [
        {
          label: "Projected Value",
          data: dataPoints,
          borderColor: "#e94057",
          backgroundColor: "rgba(233, 64, 87, 0.5)",
          tension: 0.3,
        },
      ],
    };
  }, [wallet, years, selectedAssetId, getAssetPerformance]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "var(--text-primary)",
        },
      },
      title: {
        display: true,
        text: "Asset Value Prediction",
        color: "var(--text-primary)",
      },
    },
    scales: {
      y: {
        ticks: { color: "var(--text-secondary)" },
        grid: { color: "var(--border-color)" },
      },
      x: {
        ticks: { color: "var(--text-secondary)" },
        grid: { color: "var(--border-color)" },
      },
    },
  };

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

      <div className="flex-grow card p-4 relative">
        <Line options={options} data={predictions} />
      </div>
      <div className="mt-4 text-xs text-[var(--text-secondary)]">
        * Prediction assumes constant APY and recurring transactions.
      </div>
    </div>
  );
}
