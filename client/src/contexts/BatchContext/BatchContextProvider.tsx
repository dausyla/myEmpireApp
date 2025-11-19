import { useEffect, useState, type ReactNode } from "react";
import { useWallet } from "../WalletContext/WalletContextHook";
import {
  type Asset,
  type AssetValue,
  type Directory,
  type RecurringTransaction,
  type Transaction,
  type WalletDate,
} from "../../types/WalletTypes";
import { BatchContext } from "./BatchContextHook";
import toast from "react-hot-toast";
import { api } from "../../utilies/api/api";
import { ENDPOINTS } from "../../utilies/api/endpoints";
import {
  applyDelete,
  applyInsert,
  applyUpdate,
} from "./BatchOptimisticFunctions";
import type { BatchOp, BatchResponse } from "../../types/BatchOpType";

export const BatchContextProvider = ({ children }: { children: ReactNode }) => {
  const { wallet, setWallet } = useWallet();
  const [queue, setQueue] = useState<BatchOp[]>([]);
  const [isFlushing, setIsFlushing] = useState(false);

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

  const addToQueue = (op: BatchOp) => {
    setQueue((q) => [...q, op]);
    applyOptimistic([op]);
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
    const pending = queue.find(
      (q) => q.op === "insert" && q.table === "transactions" && q.tempId === id,
    );
    if (pending) {
      // Operation not sent yet, we can remove it from the queue as we delete it
      setQueue((q) => q.filter((x) => x !== pending));
      applyOptimistic([{ op: "delete", table: "transactions", id }]);
    } else {
      addToQueue({ op: "delete", table: "transactions", id });
    }
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
    const pending = queue.find(
      (q) => q.op === "insert" && q.table === "asset_values" && q.tempId === id,
    );
    if (pending) {
      // Operation not sent yet, we can remove it from the queue as we delete it
      setQueue((q) => q.filter((x) => x !== pending));
      applyOptimistic([{ op: "delete", table: "asset_values", id }]);
    } else {
      addToQueue({ op: "delete", table: "asset_values", id });
    }
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
    const pending = queue.find(
      (q) => q.op === "insert" && q.table === "wallet_dates" && q.tempId === id,
    );
    if (pending) {
      // Operation not sent yet, we can remove it from the queue as we delete it
      setQueue((q) => q.filter((x) => x !== pending));
      applyOptimistic([{ op: "delete", table: "wallet_dates", id }]);
    } else {
      addToQueue({ op: "delete", table: "wallet_dates", id });
    }
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
    const pending = queue.find(
      (q) => q.op === "insert" && q.table === "assets" && q.tempId === id,
    );
    if (pending) {
      // Operation not sent yet, we can remove it from the queue as we delete it
      setQueue((q) => q.filter((x) => x !== pending));
      applyOptimistic([{ op: "delete", table: "assets", id }]);
    } else {
      addToQueue({ op: "delete", table: "assets", id });
    }
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
    const pending = queue.find(
      // Operation not sent yet, we can remove it from the queue as we delete it
      (q) => q.op === "insert" && q.table === "dirs" && q.tempId === id,
    );
    if (pending) {
      setQueue((q) => q.filter((x) => x !== pending));
      applyOptimistic([{ op: "delete", table: "dirs", id }]);
    } else {
      addToQueue({ op: "delete", table: "dirs", id });
    }
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
    const pending = queue.find(
      (q) =>
        q.op === "insert" &&
        q.table === "recurring_transactions" &&
        q.tempId === id,
    );
    if (pending) {
      // Operation not sent yet, we can remove it from the queue as we delete it
      setQueue((q) => q.filter((x) => x !== pending));
      applyOptimistic([{ op: "delete", table: "recurring_transactions", id }]);
    } else {
      addToQueue({ op: "delete", table: "recurring_transactions", id });
    }
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

        currentQueue.forEach((op) => {
          if (op.op === "insert" && op.tempId) {
            const real = results[idx++];
            if (!real) return;

            if (op.table === "recurring_transactions") {
              const asset = draft.assets.find((a) => a.id === op.data.asset_id);
              const temp = asset?.recurring_transactions.find(
                (t) => t.id === op.tempId,
              );
              if (temp) Object.assign(temp, real);
            }
            if (op.table === "transactions") {
              const asset = draft.assets.find((a) => a.id === op.data.asset_id);
              const temp = asset?.transactions.find((t) => t.id === op.tempId);
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
          }
        });

        return draft;
      });

      toast.success("Saved!");
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
