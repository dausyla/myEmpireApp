import { Request, Response } from "express";
import { supabase } from "../db/supabase";
import { buildWallet } from "../utils/wallet.utils";
import { WalletList } from "../types/WalletTypes";
import { BatchOp } from "../types/BatchOpType";
import {
  deleteOperation,
  insertOperation,
  updateOperation,
} from "../utils/batch.utils";

export const getWallet = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const userId = (req as any).user.id;
  const wid = Number(walletId);

  if (!Number.isInteger(wid)) {
    return res.status(400).json({ error: "invalid wallet id" });
  }

  try {
    const portfolio = await buildWallet(wid, userId);
    res.json(portfolio);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "server error" });
  }
};

export const getWallets = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const { data, error } = await supabase
      .from("wallets")
      .select("id, title, description")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const list: WalletList = data.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description || "",
    }));

    res.json(list);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "server error" });
  }
};

export const createWallet = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const userId = (req as any).user.id;

  if (!title?.trim()) {
    return res.status(400).json({ error: "title required" });
  }

  // 1. Check premium + wallet count
  try {
    const user = (req as any).user;

    if (!user.premium) {
      const { count } = await supabase
        .from("wallets")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count && count >= 1) {
        console.log("User not premium already have wallet");
        return res
          .status(403)
          .json({ error: "free users limited to 1 wallet" });
      }
    }

    // 2. Create wallet
    const { data: wallet, error } = await supabase
      .from("wallets")
      .insert({
        user_id: userId,
        title: title.trim(),
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;

    // 3. Create Root Dir
    const { data: rootDir, error: dirError } = await supabase
      .from("dirs")
      .insert({
        wallet_id: wallet.id,
        name: wallet.title,
        description: wallet.description,
      })
      .select()
      .single();

    if (dirError) throw dirError;

    res.status(201).json({ ...wallet, assets: [], dirs: [rootDir] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "server error" });
  }
};

export const batchUpdate = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const wid = Number(walletId);
  if (!Number.isInteger(wid)) {
    return res.status(400).json({ error: "invalid wallet id" });
  }

  const userId = (req as any).user.id;
  const ops: BatchOp[] = req.body;

  // 1. Validate wallet ownership
  const { data: wallet } = await supabase
    .from("wallets")
    .select("id")
    .eq("id", walletId)
    .eq("user_id", userId)
    .single();

  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  const results: any[] = [];

  try {
    for (const op of ops) {
      // === INSERT ===
      if (op.op === "insert") {
        // We send the created row so the frontend can update its id in the DB
        results.push(await insertOperation(op, wid));
      }

      // === UPDATE ===
      else if (op.op === "update") {
        await updateOperation(op);
      }

      // === DELETE ===
      else if (op.op === "delete") {
        await deleteOperation(op);
      }
    }

    res.json(results);
  } catch (err: any) {
    console.error("Batch error:", err);
    res.status(500).json({ error: err.message || "Batch failed" });
  }
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) return res.status(500).json({ error: "User not found" });

  res.json(user);
};
