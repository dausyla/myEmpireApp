export type Prediction = {
  estimatedAPY: number;
  monthlyInput: number;
};

export type Asset = {
  id: string;
  name: string;
  values: number[];
  inputs: number[];
  prediction: Prediction;
};

export type Portfolio = {
  id: string;
  name: string;
  description: string;
  assets: Asset[];
  dates: number[];
};
