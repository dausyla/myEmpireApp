import type { Color, Portfolio } from "../../../../../types/Assets";
import type { Asset } from "../../../../../types/Assets";

export function getDataset(
  portfolio: Portfolio,
  overYears: number,
  detail: boolean = false
) {
  const datasets = portfolio.assets.flatMap((asset) =>
    getDatasetForAsset(asset, overYears, detail)
  );

  const data = {
    labels: getDates(portfolio.dates, overYears).map(
      (date) => new Date(date).toISOString().split("T")[0]
    ),
    datasets,
  };

  return data;
}

function getDates(dates: number[], overYears: number) {
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

function getDatasetForAsset(
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

  return detail
    ? [
        {
          label: `${asset.name} - Inputs`,
          data: inputs,
          borderColor: color,
          backgroundColor: fadedColor,
          fill: true,
        },
        {
          label: `${asset.name} - Interests`,
          data: interests,
          borderColor: color,
          backgroundColor: fadedColor,
          fill: true,
        },
      ]
    : [
        {
          label: asset.name,
          data: totalValues,
          borderColor: color,
          backgroundColor: fadedColor,
          fill: true,
        },
      ];
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
      propagate: false,
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

const getFadedColor = (color: Color, alpha: number = 0.5) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`; // Return a string in rgba format with alpha
};

const getColorString = (c: Color) => {
  return `rgba(${c.r}, ${c.g}, ${c.b})`; // Return a string in rgba format
};
