export type Fund = {
  values: number[];
  supposedGrowthRate: number;
};

export type Transfert = {
  from: string;
  to: string;
  value: number;
  startDate: string;
  days: number;
};

export type Data = {
  dates: string[];
  funds: Record<string, Fund>;
  transferts: Record<string, Transfert>;
};
