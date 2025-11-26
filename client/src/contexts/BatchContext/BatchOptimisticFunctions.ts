// src/context/optimisticHelpers.ts
import type { BatchOp } from "@shared/BatchOpType";
import type { WalletResponse } from "@shared/WalletTypes";

export const applyInsert = (
  draft: WalletResponse,
  op: BatchOp & { op: "insert" },
) => {
  const tempId = op.tempId!;
  const now = new Date().toISOString();

  if (op.table === "transactions") {
    draft.transactions.push({
      ...op.data,
      id: tempId,
      created_at: now,
    } as any);
  }

  if (op.table === "asset_values") {
    const asset = draft.assets.find((a) => a.id === op.data.asset_id);
    if (asset) {
      asset.values.push({
        ...op.data,
        id: tempId,
      } as any);
    }
  }

  if (op.table === "wallet_dates") {
    draft.dates.push({
      ...op.data,
      id: tempId,
      created_at: now,
    } as any);
  }

  if (op.table === "assets") {
    draft.assets.push({
      ...op.data,
      id: tempId,
      created_at: now,
      values: [],
      transactions: [],
    } as any);
  }

  if (op.table === "dirs") {
    draft.dirs.push({
      ...op.data,
      id: tempId,
      created_at: now,
    } as any);
  }

  if (op.table === "recurring_transactions") {
    draft.recurring_transactions.push({
      ...op.data,
      id: tempId,
      created_at: now,
    });
  }
};

export const applyUpdate = (
  draft: WalletResponse,
  op: BatchOp & { op: "update" },
) => {
  if (op.table === "transactions") {
    const tx = draft.transactions.find((t) => t.id === op.id);
    if (tx) Object.assign(tx, op.data);
  }

  if (op.table === "asset_values") {
    draft.assets.forEach((a) => {
      const val = a.values.find((v) => v.id === op.id);
      if (val) Object.assign(val, op.data);
    });
  }

  if (op.table === "wallet_dates") {
    const date = draft.dates.find((d) => d.id === op.id);
    if (date) Object.assign(date, op.data);
  }

  if (op.table === "assets") {
    const asset = draft.assets.find((a) => a.id === op.id);
    if (asset) Object.assign(asset, op.data);
  }

  if (op.table === "dirs") {
    const dir = draft.dirs.find((d) => d.id === op.id);
    if (dir) Object.assign(dir, op.data);
  }

  if (op.table === "recurring_transactions") {
    const rt = draft.recurring_transactions?.find((r: any) => r.id === op.id);
    if (rt) Object.assign(rt, op.data);
  }
};

export const applyDelete = (
  draft: WalletResponse,
  op: BatchOp & { op: "delete" },
) => {
  const id = op.id;
  const tempId = op.tempId;

  if (op.table === "transactions") {
    draft.transactions = draft.transactions.filter(
      (t) => t.id !== id && t.id !== tempId,
    );
  }

  if (op.table === "wallet_dates") {
    draft.dates = draft.dates.filter((d) => d.id !== id && d.id !== tempId);
  }

  if (op.table === "assets") {
    draft.assets = draft.assets.filter((a) => a.id !== id && a.id !== tempId);
  }

  if (op.table === "dirs") {
    draft.dirs = draft.dirs.filter((d) => d.id !== id && d.id !== tempId);
  }

  if (op.table === "recurring_transactions") {
    draft.recurring_transactions = draft.recurring_transactions.filter(
      (r: any) => r.id !== id && r.id !== tempId,
    );
  }
};
