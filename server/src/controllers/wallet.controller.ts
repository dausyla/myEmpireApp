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

export const getWallet = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const userId = (req as any).user.id;
  const wid = Number(walletId);

  if (!Number.isInteger(wid)) {
    return res.status(400).json({ error: "invalid wallet id" });
  }

  try {
    // 1. Verify wallet ownership
    const { data: walletMeta, error: metaErr } = await supabase
      .from("wallets")
      .select("id, title, description")
      .eq("id", wid)
      .eq("user_id", userId)
      .single();

    if (metaErr || !walletMeta) {
      return res.status(404).json({ error: "wallet not found" });
    }

    // 2. Get dates (sorted)
    const { data: dates } = await supabase
      .from("wallet_dates")
      .select("id, date")
      .eq("wallet_id", wid);

    if (!dates) {
      return res.status(500).json({ error: "Error fetching dates..." });
    }

    const dateIds = dates.map((d) => d.id);
    const dateTimestamps = dates.map((d) => new Date(d.date).getTime());

    // 3. Build directory tree + assets
    const { data: dirs } = await supabase
      .from("dirs")
      .select("id, name, parent_dir_id")
      .eq("wallet_id", wid);

    if (!dirs) {
      return res.status(500).json({ error: "Error fetching dirs..." });
    }

    const { data: assets } = await supabase
      .from("assets")
      .select(
        `
        id, name, color, estimated_apy, count_first_input, dir_id,
        asset_values!asset_id (date_id, value),
        transactions!asset_id (date_id, amount, type)
      `,
      )
      .eq("wallet_id", wid)
      .in("asset_values.date_id", dateIds)
      .in("transactions.date_id", dateIds);

    if (!assets) {
      return res.status(500).json({ error: "Error fetching assets..." });
    }

    // Build map: dirId → Directory
    const dirMap = new Map<number, Directory>();
    dirs.forEach((d) => {
      dirMap.set(d.id, {
        id: d.id,
        name: d.name,
        isOpened: false,
        subDirs: [],
        subAssets: [],
        parentDirId: d.parent_dir_id || 0,
      });
    });

    // Link subdirs
    dirs.forEach((d) => {
      if (d.parent_dir_id) {
        const parent = dirMap.get(d.parent_dir_id);
        const child = dirMap.get(d.id);
        if (parent && child) parent.subDirs.push(child);
      }
    });

    // Root dirs
    const rootDirs = Array.from(dirMap.values()).filter((d) => !d.parentDirId);

    // Process assets
    assets.forEach((asset) => {
      const values = new Array(dateIds.length).fill(0);
      const inputs = new Array(dateIds.length).fill(0);

      asset.asset_values.forEach((av: any) => {
        const idx = dateIds.indexOf(av.date_id);
        if (idx !== -1) values[idx] = av.value;
      });

      asset.transactions.forEach((tx: any) => {
        const idx = dateIds.indexOf(tx.date_id);
        if (idx !== -1) {
          if (tx.type === "deposit" || tx.type === "reward") {
            inputs[idx] += tx.amount;
          } else if (tx.type === "withdrawal" || tx.type === "fee") {
            inputs[idx] -= tx.amount;
          }
        }
      });

      // Prediction
      const monthlyInput =
        inputs.reduce((a, b) => a + b, 0) / dateTimestamps.length || 0;
      const prediction: Prediction = {
        estimatedAPY: asset.estimated_apy || 0,
        monthlyInput,
      };

      // Color
      const hex = asset.color || "#3B82F6";
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      const assetObj: Asset = {
        id: asset.id,
        name: asset.name,
        values,
        inputs,
        prediction,
        color: { r, g, b },
        countFirstInput: asset.count_first_input,
        parentDirID: asset.dir_id,
      };

      const dir = dirMap.get(asset.dir_id);
      if (dir) dir.subAssets.push(assetObj);
    });

    const root: Directory = {
      id: 0,
      name: "Root",
      isOpened: true,
      subDirs: rootDirs,
      subAssets: [],
      parentDirId: 0,
    };

    const portfolio: Portfolio = {
      id: walletMeta.id.toString(),
      name: walletMeta.title,
      description: walletMeta.description || "",
      root,
      dates: dateTimestamps,
      assetNumber: assets.length,
      dirNumber: dirs.length,
    };

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
