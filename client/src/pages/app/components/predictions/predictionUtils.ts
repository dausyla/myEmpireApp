import type { Asset, Color, Directory } from "../../../../types/WalletTypes";

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

type AssetPrediction = {
  id: number;
  totalValues: number[];
  inputs: number[];
  interests: number[];
};

function getPredictionsForAsset(
  asset: Asset,
  overYears: number,
): AssetPrediction {
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
  return { id: asset.id, totalValues, inputs, interests };
}

export type Prediction = {
  name: string;
  color: Color;
  totalValues: number[];
  interests: number[];
  inputs: number[];
};

function getClosedDirectoryPredictions(dir: Directory, overYears: number) {
  const res: Prediction = {
    name: dir.name,
    color: { r: 80, g: 200, b: 0 },
    totalValues: [],
    interests: [],
    inputs: [],
  };

  dir.subDirs.forEach((d) => {
    const pred = getClosedDirectoryPredictions(d, overYears);
    if (pred) {
      if (res.totalValues.length == 0) {
        // first asset
        res.totalValues = pred.totalValues;
        res.inputs = pred.inputs;
        res.interests = pred.interests;
      } else {
        for (let i = 0; i < res.totalValues.length; i++) {
          res.totalValues[i] += pred.totalValues[i];
          res.inputs[i] += pred.inputs[i];
          res.interests[i] += pred.interests[i];
        }
      }
    }
  });

  dir.subAssets.forEach((a) => {
    const pred = getPredictionsForAsset(a, overYears);
    if (res.totalValues.length == 0) {
      // first asset
      res.totalValues = pred.totalValues;
      res.inputs = pred.inputs;
      res.interests = pred.interests;
    } else {
      for (let i = 0; i < res.totalValues.length; i++) {
        res.totalValues[i] += pred.totalValues[i];
        res.inputs[i] += pred.inputs[i];
        res.interests[i] += pred.interests[i];
      }
    }
  });

  return res.totalValues.length > 0 ? res : null;
}

export function getDirectoryPredictions(
  from: Directory,
  overYears: number,
): Prediction[] {
  const res: Prediction[] = [];

  if (from.isOpened) {
    from.subDirs.forEach((d) =>
      res.push(...getDirectoryPredictions(d, overYears)),
    );
    from.subAssets.forEach((a) => {
      const prediction = getPredictionsForAsset(a, overYears);
      res.push({
        name: a.name,
        color: a.color,
        ...prediction,
      });
    });
  } else {
    const closed = getClosedDirectoryPredictions(from, overYears);
    // closed == null => no assets inside
    if (closed) res.push(closed);
  }

  return res;
}

export const graphOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      stacked: true,
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
