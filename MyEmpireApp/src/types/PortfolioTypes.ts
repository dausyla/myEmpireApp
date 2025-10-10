export type Prediction = {
  estimatedAPY: number;
  monthlyInput: number;
};

export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Directory = {
  id: number;
  name: string;
  isOpened: boolean;
  subDirs: Directory[];
  subAssets: Asset[];
  parentDirId: number;
};

export type Asset = {
  id: number;
  name: string;
  values: number[];
  inputs: number[];
  prediction: Prediction;
  color: Color;
  countFirstInput?: boolean;
  parentDirID: number;
};

export type Portfolio = {
  id: string;
  name: string;
  description: string;
  root: Directory;
  dates: number[];
  assetNumber: number;
  dirNumber: number;
};

export type AssetPerformance = {
  totalValue: number;
  totalInput: number;
  totalInterests: number;
  totalGrowth: number;
  apy: number;
  timeSpentInYears: number;
};
