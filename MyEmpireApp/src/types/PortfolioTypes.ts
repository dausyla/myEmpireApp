export type Prediction = {
  estimatedAPY: number;
  monthlyInput: number;
};

export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Asset = {
  id: number;
  name: string;
  values: number[];
  inputs: number[];
  prediction: Prediction;
  color: Color;
};

export type Portfolio = {
  id: string;
  name: string;
  description: string;
  assets: Asset[];
  dates: number[];
};

export type AssetPerformance = {
  totalValue: number;
  totalInput: number;
  totalInterests: number;
  totalGrowth: number;
  apy: number;
  timeSpentInYears: number;
};
