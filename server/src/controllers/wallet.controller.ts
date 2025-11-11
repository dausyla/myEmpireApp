import { Request, Response } from "express";
import { supabase } from "../db/supabase";
import { BatchChange } from "../types";
import {
  Asset,
  Directory,
  Portfolio,
  PortfolioList,
  Prediction,
} from "../types/FrontendPortfolioTypes";
import { buildFrontendWallet } from "../utils/wallet.utils";

export const getWallet = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const userId = (req as any).user.id;
  const wid = Number(walletId);

  if (!Number.isInteger(wid)) {
    return res.status(400).json({ error: "invalid wallet id" });
  }

  try {
    const portfolio = await buildFrontendWallet(wid, userId);
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

    const list: PortfolioList = data.map((w) => ({
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

    res.status(201).json(wallet);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "server error" });
  }
};

export const batchUpdate = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const { changes, userId } = req.body as {
    changes: BatchChange[];
    userId: string;
  };

  // Vérifie que le wallet appartient à l'user
  const { data: wallet } = await supabase
    .from("wallets")
    .select()
    .eq("id", walletId)
    .eq("user_id", userId)
    .single();

  if (!wallet) return res.status(404).json({ error: "Wallet not found" });

  const client = supabase; // transaction implicite via batch

  try {
    for (const change of changes) {
      if (change.type === "update_value") {
        const { assetId, dateIndex, value } = change;

        const { data: dateRow } = await client
          .from("wallet_dates")
          .select("id")
          .eq("wallet_id", walletId)
          .eq("index", dateIndex)
          .single();

        if (!dateRow) continue;

        await client
          .from("asset_values")
          .upsert(
            { asset_id: assetId, date_id: dateRow.id, value },
            { onConflict: "asset_id,date_id" },
          );
      }

      if (change.type === "add_transaction") {
        const { assetId, dateIndex, amount, transType } = change;

        const { data: dateRow } = await client
          .from("wallet_dates")
          .select("id")
          .eq("wallet_id", walletId)
          .eq("index", dateIndex)
          .single();

        if (!dateRow) continue;

        await client.from("transactions").insert({
          asset_id: assetId,
          date_id: dateRow.id,
          amount,
          type: transType,
        });
      }

      if (change.type === "add_date") {
        const { date, index } = change;

        // Appelle la fonction SQL
        const { data, error } = await client.rpc("insert_wallet_date", {
          p_wallet_id: Number(walletId),
          p_date: date,
          p_index: index ?? null,
        });

        if (error) {
          console.error("Error inserting date:", error);
          continue;
        }
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) return res.status(500).json({ error: "User not found" });

  res.json(user);
};
