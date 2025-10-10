import type { Asset } from "../../../../../types/PortfolioTypes";
import {
  getColorString,
  getFadedColor,
} from "../../../../utilies/utilsFunctions";

export function getDates(dates: number[], overYears: number) {
  if (dates.length === 0) return [];

  const lastDate = new Date(dates[dates.length - 1]);
  const newDates = [];

  const nextDate = new Date(lastDate);
  for (let i = 0; i < overYears * 12; i++) {
    nextDate.setMonth(nextDate.getMonth() + 1);
    if (nextDate.getMonth() === 0) {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    newDates.push(nextDate.getTime());
  }

  return [...dates, ...newDates];
}

export function getDatasetForAsset(
  asset: Asset,
  overYears: number,
  detail: boolean = false
) {
  const color = getColorString(asset.color);
  const fadedColor = getFadedColor(asset.color, 0.5);

  const inputs = asset.inputs.reduce<number[]>((acc, input, i) => {
    if (i === 0) {
      acc.push(input);
    } else {
      acc.push(acc[i - 1] + input);
    }
    return acc;
  }, []);
  const totalValues = asset.values.slice();
  const interests = asset.values.map((v, i) => v - inputs[i]);

  const monthlyInput = asset.prediction.monthlyInput || 0;
  const estimatedAPY = asset.prediction.estimatedAPY || 0;
  for (let i = 0; i < overYears * 12; i++) {
    const lastValue = totalValues[totalValues.length - 1];
    const monthlyGrowth = lastValue * (estimatedAPY / 12);

    const newValue = lastValue + monthlyGrowth + monthlyInput;
    totalValues.push(newValue);
    inputs.push(inputs[inputs.length - 1] + monthlyInput);
    interests.push(newValue - inputs[inputs.length - 1]);
  }

  const fill = "-1"; // fill to the previous dataset

  const res = detail
    ? [
        {
          label: `${asset.name} - Inputs`,
          data: inputs,
          borderColor: color,
          backgroundColor: fadedColor,
          fill,
        },
        {
          label: `${asset.name} - Interests`,
          data: interests,
          borderColor: color,
          backgroundColor: fadedColor,
          fill,
        },
      ]
    : [
        {
          label: asset.name,
          data: totalValues,
          borderColor: color,
          backgroundColor: fadedColor,
          fill,
        },
      ];

  return res;
}

export const graphOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      stacked: true,
      min: 0,
    },
  },
  plugins: {
    filler: {
      // propagate: false,
    },
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Portfolio Value Over Time",
    },
  },
};
