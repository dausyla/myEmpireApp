import { useEffect, useState, type ReactNode } from "react";
import { useWallet } from "../WalletContext/WalletContextHook";
import {
  type Asset,
  type AssetValue,
  type Directory,
  type RecurringTransaction,
  type Transaction,
  type WalletDate,
} from "@shared/WalletTypes";
import { BatchContext } from "./BatchContextHook";
import toast from "react-hot-toast";
import { api } from "../../utilies/api/api";
import { ENDPOINTS } from "../../utilies/api/endpoints";
import {
  applyDelete,
  applyInsert,
  applyUpdate,
} from "./BatchOptimisticFunctions";
import type { BatchOp, BatchResponse } from "@shared/BatchOpType";

export const BatchContextProvider = ({ children }: { children: ReactNode }) => {
  const { wallet, setWallet } = useWallet();
  const [queue, setQueue] = useState<BatchOp[]>([]);
  const [isFlushing, setIsFlushing] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<Record<number, number>>({});

  // Auto-flush every 3s
  useEffect(() => {
    if (queue.length === 0 || isFlushing) return;
    const timer = setTimeout(() => flush(), 3000);
    return () => clearTimeout(timer);
  }, [queue, isFlushing]);

  // Used when deleting an unsent inserted data
  const withTempId = <T extends { op: "insert" }>(
    op: T,
  ): T & { tempId: number } => ({
    ...op,
    tempId: -Date.now(),
  });

  const addToQueue = (newOp: BatchOp) => {
    setQueue((currentQueue) => {
      // We look for an existing operation on the same object
      // For inserts, we check tempId. For others, we check id.
      // But wait, if we have an insert in the queue, it has a tempId.
      // Subsequent updates/deletes will refer to that tempId if they happen before flush.
      // So we should check if newOp.id matches any existing op.id or op.tempId.

      const targetId =
        newOp.op === "insert" ? newOp.tempId : (newOp as any).id;

      const existingOpIndex = currentQueue.findIndex((q) => {
        const qId = q.op === "insert" ? q.tempId : (q as any).id;
        return q.table === newOp.table && qId === targetId;
      });

      if (existingOpIndex === -1) {
        return [...currentQueue, newOp];
      }

      const existingOp = currentQueue[existingOpIndex];
      const newQueue = [...currentQueue];

      // Case 1: Insert + Update
      if (existingOp.op === "insert" && newOp.op === "update") {
        // Merge updates into the insert data
        existingOp.data = { ...existingOp.data, ...(newOp.data as any) };
        // We modify existingOp in place (in the copy), so no need to push newOp
        newQueue[existingOpIndex] = existingOp;
        return newQueue;
      }

      // Case 2: Insert + Delete
      if (existingOp.op === "insert" && newOp.op === "delete") {
        // The object was never sent, so we just remove the insert operation
        newQueue.splice(existingOpIndex, 1);
        return newQueue;
      }

      // Case 3: Update + Update
      if (existingOp.op === "update" && newOp.op === "update") {
        // Merge new updates into existing updates
        existingOp.data = { ...existingOp.data, ...(newOp.data as any) };
        newQueue[existingOpIndex] = existingOp;
        return newQueue;
      }

      // Case 4: Update + Delete
      if (existingOp.op === "update" && newOp.op === "delete") {
        // We replace the update with the delete, because the object needs to be deleted anyway
        // and previous updates are irrelevant.
        newQueue[existingOpIndex] = newOp;
        return newQueue;
      }

      // Default: just append (shouldn't happen with above logic covering common cases, but for safety)
      return [...currentQueue, newOp];
    });

    // We still apply optimistic updates to the local state
    // Note: If we coalesced, we might be applying redundant optimistic updates,
    // but applyOptimistic handles "update" by finding the object.
    // If we did Insert+Delete, we need to make sure applyOptimistic handles it correctly.
    // Actually, applyOptimistic is "dumb" and just applies what we pass.
    // If we coalesced "Insert+Delete" into "Nothing", we shouldn't call applyOptimistic with "Delete".
    // BUT, addToQueue is called with `newOp`.
    // If we want the local state to reflect the queue state, we should probably
    // apply the `newOp` optimistically.
    // Example: Insert (applied). Update (applied).
    // Example: Insert (applied). Delete (applied).
    // So yes, we always apply the new op optimistically.
    applyOptimistic([newOp]);
  };

  const applyOptimistic = (ops: BatchOp[]) => {
    if (!wallet) return;
    setWallet((prev) => {
      if (!prev) return prev;
      const draft = { ...prev };

      ops.forEach((op) => {
        if (op.op === "insert") applyInsert(draft, op);
        if (op.op === "update") applyUpdate(draft, op);
        if (op.op === "delete") applyDelete(draft, op);
      });

      return draft;
    });
  };

  // === Transactions ===
  const addTransaction = (tx: Omit<Transaction, "id" | "created_at">) => {
    const op: BatchOp = { op: "insert", table: "transactions", data: tx };
    addToQueue(withTempId(op));
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    addToQueue({ op: "update", table: "transactions", id, data: updates });
  };

  const deleteTransaction = (id: number) => {
    addToQueue({ op: "delete", table: "transactions", id });
  };

  // === Asset Values ===
  const addAssetValue = (value: Omit<AssetValue, "id" | "created_at">) => {
    const op: BatchOp = { op: "insert", table: "asset_values", data: value };
    addToQueue(withTempId(op));
  };
  const updateAssetValue = (id: number, updates: Partial<AssetValue>) => {
    addToQueue({ op: "update", table: "asset_values", id, data: updates });
  };
  const deleteAssetValue = (id: number) => {
    addToQueue({ op: "delete", table: "asset_values", id });
  };

  // === Dates ===
  const addDate = (date: Omit<WalletDate, "id" | "created_at">) => {
    const op: BatchOp = { op: "insert", table: "wallet_dates", data: date };
    addToQueue(withTempId(op));
  };

  const updateDate = (id: number, updates: Partial<WalletDate>) => {
    addToQueue({ op: "update", table: "wallet_dates", id, data: updates });
  };

  const deleteDate = (id: number) => {
    addToQueue({ op: "delete", table: "wallet_dates", id });
  };

  // === Assets ===
  const addAsset = (
    asset: Omit<
      Asset,
      "id" | "created_at" | "recurring_transactions" | "transactions" | "values"
    >,
  ) => {
    const op: BatchOp = { op: "insert", table: "assets", data: asset };
    addToQueue(withTempId(op));
  };

  const updateAsset = (id: number, updates: Partial<Asset>) => {
    addToQueue({ op: "update", table: "assets", id, data: updates });
  };

  const deleteAsset = (id: number) => {
    addToQueue({ op: "delete", table: "assets", id });
  };

  // === Dirs ===
  const addDir = (dir: Omit<Directory, "id" | "created_at">) => {
    const op: BatchOp = { op: "insert", table: "dirs", data: dir };
    addToQueue(withTempId(op));
  };

  const updateDir = (id: number, updates: Partial<Directory>) => {
    addToQueue({ op: "update", table: "dirs", id, data: updates });
  };

  const deleteDir = (id: number) => {
    addToQueue({ op: "delete", table: "dirs", id });
  };

  // === Recurring ===
  const addRecurring = (
    rt: Omit<RecurringTransaction, "id" | "created_at">,
  ) => {
    const op: BatchOp = {
      op: "insert",
      table: "recurring_transactions",
      data: rt,
    };
    addToQueue(withTempId(op));
  };

  const updateRecurring = (
    id: number,
    updates: Partial<RecurringTransaction>,
  ) => {
    addToQueue({
      op: "update",
      table: "recurring_transactions",
      id,
      data: updates,
    });
  };

  const deleteRecurring = (id: number) => {
    addToQueue({ op: "delete", table: "recurring_transactions", id });
  };

  const flush = async () => {
    if (queue.length === 0 || isFlushing || !wallet) return;
    setIsFlushing(true);
    const currentQueue = [...queue];
    setQueue([]);

    try {
      const res = await api<BatchResponse>(
        ENDPOINTS.WALLETS.BATCH(wallet.wallet.id),
        "POST",
        currentQueue,
      );

      const results = res as any[];

      setWallet((prev) => {
        if (!prev) return prev;
        const draft = { ...prev };
        let idx = 0;
        const newResolvedIds: Record<number, number> = {};

        currentQueue.forEach((op) => {
          if (op.op === "insert" && op.tempId) {
            const real = results[idx++];
            if (!real) return;

            newResolvedIds[op.tempId] = real.id;

            if (op.table === "recurring_transactions") {
              const temp = draft.recurring_transactions.find(
                (t) => t.id === op.tempId,
              );
              if (temp) Object.assign(temp, real);
            }
            if (op.table === "transactions") {
              const temp = draft.transactions.find((t) => t.id === op.tempId);
              if (temp) Object.assign(temp, real);
            }
            if (op.table === "asset_values") {
              const asset = draft.assets.find((a) => a.id === op.data.asset_id);
              const temp = asset?.values.find((v) => v.id === op.tempId);
              if (temp) Object.assign(temp, real);
            }
            if (op.table === "wallet_dates") {
              const temp = draft.dates.find((d) => d.id === op.tempId);
              if (temp) Object.assign(temp, real);
            }
            if (op.table === "assets") {
              const temp = draft.assets.find((a) => a.id === op.tempId);
              if (temp) Object.assign(temp, real);
            }
            if (op.table === "dirs") {
              const temp = draft.dirs.find((d) => d.id === op.tempId);
              if (temp) Object.assign(temp, real);
            }
          }
        });

        setResolvedIds((prev) => ({ ...prev, ...newResolvedIds }));

        return draft;
      });
    } catch (err) {
      toast.error("Sync failed – retrying...");
      setQueue((q) => [...q, ...currentQueue]);
    } finally {
      setIsFlushing(false);
    }
  };

  return (
    <BatchContext.Provider
      value={{
        queue,
        isFlushing,
        resolvedIds,
        flush,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addAssetValue,
        updateAssetValue,
        deleteAssetValue,
        addDate,
        updateDate,
        deleteDate,
        addAsset,
        updateAsset,
        deleteAsset,
        addDir,
        updateDir,
        deleteDir,
        addRecurring,
        updateRecurring,
        deleteRecurring,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};
