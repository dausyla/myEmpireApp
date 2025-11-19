import { supabase } from "../db/supabase";
import { BatchOp } from "../types/BatchOpType";

export const insertOperation = async (
  op: BatchOp & { op: "insert" },
  walletId: number,
) => {
  let data: any = op.data;

  // Auto-fill wallet_id where needed
  if (op.table === "wallet_dates" || op.table === "dirs") {
    data = { ...data, wallet_id: walletId };
  }

  // Remove the tempId field before inserting in the battery
  delete data.tempId;

  const { data: row, error } = await supabase
    .from(op.table)
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return row;
};
export const updateOperation = async (op: BatchOp & { op: "update" }) => {
  const { data: row, error } = await supabase
    .from(op.table)
    .update(op.data)
    .eq("id", op.id)
    .select()
    .single();

  if (error) throw error;
};

export const deleteOperation = async (op: BatchOp & { op: "delete" }) => {
  // Only delete if real ID (tempId ignored)
  if (op.id > 0) {
    const { error } = await supabase.from(op.table).delete().eq("id", op.id);
    if (error) throw error;
  }
};
