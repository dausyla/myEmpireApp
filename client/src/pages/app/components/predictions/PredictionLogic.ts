import type { Asset, RecurringTransaction } from "@shared/WalletTypes";
import type { AssetPerformancePerDate } from "../../../../types/DataTypes";

export interface PredictionDataset {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  borderDash?: number[];
  fill?: boolean | string;
}

export interface PredictionResult {
  labels: string[];
  datasets: PredictionDataset[];
}

export const calculatePredictionAsset = (
  asset: Asset,
  years: number,
  isDetailed: boolean,
  assetPerfPerDate: Record<number, AssetPerformancePerDate>,
  recurringTransactions: RecurringTransaction[],
  sortedDates: any[],
): PredictionResult => {
  const historicalLabels = sortedDates.map((d) => d.date);
  const futureLabels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
  const labels = [...historicalLabels, ...futureLabels];

  // Helper to get asset color
  const assetColor = getColorString(asset.color);
  const fadedColor = getFadedColor(asset.color);

  // 1. Historical Data for this asset
  const historicalValues = sortedDates.map(
    (d) => assetPerfPerDate[d.id]?.value || 0,
  );
  const lastValue = historicalValues[historicalValues.length - 1] || 0;

  // 2. Calculate monthly contribution
  const monthlyContribution = calculateMonthlyContribution(
    asset,
    recurringTransactions,
  );

  let datasets: PredictionDataset[] = [];

  if (!isDetailed) {
    datasets = calculateStandardPrediction(
      asset,
      years,
      historicalValues,
      lastValue,
      monthlyContribution,
      assetColor,
      fadedColor,
    );
  } else {
    datasets = calculateDetailedPrediction(
      asset,
      years,
      historicalValues,
      lastValue,
      monthlyContribution,
      assetColor,
      fadedColor,
    );
  }

  return { labels, datasets };
};

function calculateMonthlyContribution(
  asset: Asset,
  recurringTransactions: RecurringTransaction[],
): number {
  let monthlyContribution = 0;
  recurringTransactions.forEach((t) => {
    if (t.to_asset_id !== asset.id && t.from_asset_id !== asset.id) return;

    let amount = t.amount;
    if (t.type === "withdrawal" || t.type === "fee") amount = -amount;

    // If transfer out of this asset
    if (t.from_asset_id === asset.id) amount = -Math.abs(amount);

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
  return monthlyContribution;
}

function calculateStandardPrediction(
  asset: Asset,
  years: number,
  historicalValues: number[],
  lastValue: number,
  monthlyContribution: number,
  assetColor: string,
  fadedColor: string,
): PredictionDataset[] {
  const datasets: PredictionDataset[] = [];
  const apy = asset.estimated_apy || 0;

  // Generate Prediction Data
  const predictionValues = [];
  const predictionPadding = Array(historicalValues.length - 1).fill(null);
  predictionValues.push(...predictionPadding, lastValue);

  let runningValue = lastValue;
  for (let i = 1; i <= years; i++) {
    runningValue += monthlyContribution * 12;
    runningValue *= 1 + apy / 100;
    predictionValues.push(runningValue);
  }

  datasets.push({
    label: asset.name,
    data: predictionValues.map((v, i) =>
      i < historicalValues.length ? historicalValues[i] : v,
    ),
    borderColor: assetColor,
    backgroundColor: fadedColor,
    fill: true,
  });

  return datasets;
}

function calculateDetailedPrediction(
  asset: Asset,
  years: number,
  historicalValues: number[],
  lastValue: number,
  monthlyContribution: number,
  assetColor: string,
  fadedColor: string,
): PredictionDataset[] {
  const datasets: PredictionDataset[] = [];

  // --- Base Line (Constant) ---
  const baseData = [...historicalValues];
  for (let i = 0; i < years; i++) {
    baseData.push(lastValue);
  }

  datasets.push({
    label: asset.name,
    data: baseData,
    borderColor: assetColor,
    backgroundColor: fadedColor,
    fill: true,
  });

  // --- Interests & Inputs Calculation ---
  const apy = asset.estimated_apy || 0;

  let accumulatedInterests = 0;
  let accumulatedInputs = 0;

  const interestsPoints = [];
  const inputsPoints = [];
  let total = lastValue;

  for (let i = 1; i <= years; i++) {
    for (let j = 1; j <= 12; j++) {
      // Add inputs
      const monthlyInputs = monthlyContribution;
      accumulatedInputs += monthlyInputs;
      total += monthlyInputs;

      // Add interests (on the whole amount)
      const monthlyInterests = total * (apy / 100 / 12);
      accumulatedInterests += monthlyInterests;
      total += monthlyInterests;
    }

    interestsPoints.push(accumulatedInterests);
    inputsPoints.push(accumulatedInputs);
  }

  // Add to datasets
  // Interests Line
  const interestsFullData = [...Array(historicalValues.length).fill(null)];
  interestsFullData[historicalValues.length - 1] = 0; // Connect
  interestsFullData.push(...interestsPoints);

  if (asset.estimated_apy && asset.estimated_apy > 0) {
    const c = adjustColor(assetColor, 20);
    datasets.push({
      label: asset.name + " - Interests",
      data: interestsFullData,
      borderColor: c,
      backgroundColor: getFadedColor(c),
      borderDash: [5, 5],
      fill: "-1",
    });

    // Inputs Line
    const inputsFullData = [...Array(historicalValues.length).fill(null)];
    inputsFullData[historicalValues.length - 1] = 0; // Connect
    inputsFullData.push(...inputsPoints);

    if (monthlyContribution > 0) {
      const c = adjustColor(assetColor, -20);
      datasets.push({
        label: asset.name + " - Inputs",
        data: inputsFullData,
        borderColor: c,
        backgroundColor: getFadedColor(c),
        borderDash: [2, 2],
        fill: "-1",
      });
    }
  }

  return datasets;
}

// Helper to adjust color brightness
function adjustColor(color: string, amount: number) {
  if (!color) return "#000000";

  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00ff) + amount;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000ff) + amount;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function getColorString(color: any): string {
  if (!color) return "#000000";
  if (typeof color === "string") return color;
  if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a || 1})`;
  }
  return "#000000";
}

function getFadedColor(color: any): string {
  if (!color) return "rgba(0, 0, 0, 0.1)";
  if (typeof color === "string") {
    // Hex to rgba
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, 0.1)`;
    }
    return color;
  }
  if (color.r !== undefined) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`;
  }
  return "rgba(0, 0, 0, 0.1)";
}
