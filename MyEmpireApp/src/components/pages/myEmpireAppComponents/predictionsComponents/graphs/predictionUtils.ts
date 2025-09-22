import type { Asset } from "../../../../../types/Assets";

// Returns the dates lists + overMonths dates after the last date in the list
export function getDates(dates: number[], overMonths: number) {
  if (dates.length === 0) return [];

  const lastDate = new Date(dates[dates.length - 1]);
  const newDates = [];

  const nextDate = new Date(lastDate);
  for (let i = 0; i < overMonths; i++) {
    nextDate.setMonth(nextDate.getMonth() + 1);
    if (nextDate.getMonth() === 0) {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    newDates.push(nextDate.getTime());
  }

  return [...dates, ...newDates];
}

export function getPredictedValues(asset: Asset, overMonths: number) {
  const predictedValues = [];
  let lastValue = asset.values[asset.values.length - 1];
  const monthlyInput = asset.prediction.monthlyInput;
  const estimatedAPY = asset.prediction.estimatedAPY;

  for (let i = 0; i < overMonths; i++) {
    const newValue = lastValue * (1 + estimatedAPY / 12) + monthlyInput;
    predictedValues.push(newValue);
    lastValue = newValue;
  }

  return [...asset.values, ...predictedValues];
}
