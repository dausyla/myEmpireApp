import type { Asset, AssetPerformance, Color } from "../types/WalletTypes";

export const getFadedColor = (color: Color, alpha: number = 0.5) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`; // Return a string in rgba format with alpha
};

export const getColorString = (c: Color) => {
  return `rgba(${c.r}, ${c.g}, ${c.b})`; // Return a string in rgba format
};

export const getAssetPerformence: (
  asset: Asset,
  dates: number[],
) => AssetPerformance = (asset: Asset, dates: number[]) => {
  if (dates.length === 0) {
    return {
      totalValue: 0,
      totalInput: 0,
      totalInterests: 0,
      totalGrowth: 0,
      apy: 0,
      timeSpentInYears: 0,
    };
  }
  const totalValue = asset.values[asset.values.length - 1]; // Last Value
  const totalInput = asset.inputs.reduce((a, b) => a + b, 0);
  const totalGrowth = totalValue / totalInput - 1;
  const firstDateAsset = dates.find((_, index) => asset.values[index] > 0);

  const timeSpentInYears = firstDateAsset
    ? (dates[dates.length - 1] - firstDateAsset) / (1000 * 60 * 60 * 24 * 365)
    : 0;

  const apy = timeSpentInYears ? totalGrowth / timeSpentInYears : 0;
  return {
    totalValue,
    totalInput,
    totalInterests: totalValue - totalInput,
    totalGrowth,
    apy,
    timeSpentInYears,
  };
};
