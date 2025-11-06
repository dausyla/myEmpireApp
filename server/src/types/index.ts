export type BatchChange =
  | { type: 'update_value'; assetId: number; dateIndex: number; value: number }
  | { type: 'add_transaction'; assetId: number; dateIndex: number; amount: number; transType: string }
  | { type: 'add_date'; date: string; index?: number };