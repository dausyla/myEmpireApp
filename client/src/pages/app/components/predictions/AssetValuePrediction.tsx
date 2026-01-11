import { useState, useMemo, useEffect } from "react";
import { useWindowContext } from "../Windows/WindowContext";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { AssetValueChart } from "./AssetValueChart";
import {
  calculatePredictionRecursive,
} from "./PredictionLogic";
import { PredictionHeader } from "./PredictionHeader";

export function AssetValuePrediction() {
  const { wallet } = useWallet();
  const { currentItem, openedDirs } = useApp();
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
    return calculatePredictionRecursive(
      currentItem,
      openedDirs,
      wallet,
      years,
      isDetailed,
      getAssetPerformancePerDates,
      getSortedDates(),
      getAllAssetsInDirectory,
    );
  }, [
    currentItem,
    openedDirs,
    wallet,
    years,
    isDetailed,
    getAssetPerformancePerDates,
    getSortedDates,
    getAllAssetsInDirectory,
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
      <div className="text-xs text-(--text-secondary)">
        * Prediction assumes constant APY and recurring transactions.
      </div>
    </div>
  );
}
