import { supabase } from "../db/supabase";
import {
  Asset,
  Directory,
  Portfolio,
  Prediction,
} from "../types/FrontendPortfolioTypes";

export const buildFrontendWallet = async (walletID: number, userId: string) => {
  // 1. Verify wallet ownership
  const { data: walletMeta, error: metaErr } = await supabase
    .from("wallets")
    .select("id, title, description")
    .eq("id", walletID)
    .eq("user_id", userId)
    .single();

  if (metaErr || !walletMeta) {
    throw new Error("wallet not found");
  }

  // 2. Get dates (sorted)
  const { data: dates } = await supabase
    .from("wallet_dates")
    .select("id, date")
    .eq("wallet_id", walletID);

  if (!dates) {
    throw new Error("Error fetching dates...");
  }

  const dateIds = dates.map((d) => d.id);
  const dateTimestamps = dates.map((d) => new Date(d.date).getTime());

  // 3. Build directory tree + assets
  const { data: dirs } = await supabase
    .from("dirs")
    .select("id, name, parent_dir_id")
    .eq("wallet_id", walletID);

  if (!dirs) {
    throw new Error("Error fetching dirs...");
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
    .eq("wallet_id", walletID)
    .in("asset_values.date_id", dateIds)
    .in("transactions.date_id", dateIds);

  if (!assets) {
    throw new Error("Error fetching assets...");
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
};
