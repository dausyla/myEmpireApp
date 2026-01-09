import { useState, useMemo, useEffect } from "react";
import { useWindowContext } from "../Windows/WindowContext";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { AssetValueChart } from "./AssetValueChart";
import {
  calculatePredictionAsset,
  calculatePredictionDirectory,
} from "./PredictionLogic";
import { PredictionHeader } from "./PredictionHeader";

export function AssetValuePrediction() {
  const { wallet } = useWallet();
  const { currentItem } = useApp();
  const {
    getAssetPerformancePerDates,
    getSortedDates,
    getAllAssetsInDirectory,
  } = useData();
  const { setHeaderActions } = useWindowContext();
  const [years, setYears] = useState(10);
  const [isDetailed, setIsDetailed] = useState(false);

  useEffect(() => {
    setHeaderActions(
      <PredictionHeader
        years={years}
        setYears={setYears}
        isDetailed={isDetailed}
        setIsDetailed={setIsDetailed}
      />,
    );
  }, [years, isDetailed, setHeaderActions]);

  if (!wallet || !currentItem)
    return <div className="p-4">Please select an item.</div>;

  const chartData = useMemo(() => {
    if (currentItem.type === "asset") {
      const currentAsset = wallet.assets.find((a) => a.id === currentItem.id);
      if (!currentAsset) return null;
      return calculatePredictionAsset(
        currentAsset,
        years,
        isDetailed,
        getAssetPerformancePerDates(currentAsset.id),
        wallet.recurring_transactions,
        getSortedDates(),
      );
    } else {
      // Directory
      const assets = getAllAssetsInDirectory(currentItem.id);
      return calculatePredictionDirectory(
        assets,
        years,
        isDetailed,
        getAssetPerformancePerDates,
        wallet.recurring_transactions,
        getSortedDates(),
      );
    }
  }, [
    currentItem,
    years,
    isDetailed,
    getAssetPerformancePerDates,
    wallet.recurring_transactions,
    getSortedDates,
    getAllAssetsInDirectory,
    wallet.assets,
  ]);

  if (!chartData) return <div className="p-4">Please select an item.</div>;

  return (
    <div className="h-full flex flex-col p-1">
      <div className="grow relative min-h-0">
        <AssetValueChart
          labels={chartData.labels}
          datasets={chartData.datasets}
        />
      </div>
      <div className="mt-4 text-xs text-(--text-secondary)">
        * Prediction assumes constant APY and recurring transactions.
      </div>
    </div>
  );
}
