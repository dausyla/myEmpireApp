// src/utils/buildWallet.ts
import { supabase } from "../db/supabase";
import { WalletResponse } from "../types/WalletTypes";

export const buildWallet = async (
  walletID: number,
  userId: string,
): Promise<WalletResponse> => {
  // 1. Wallet + ownership
  const { data: wallet, error: walletErr } = await supabase
    .from("wallets")
    .select("id, title, description, user_id, created_at, updated_at")
    .eq("id", walletID)
    .eq("user_id", userId)
    .single();

  if (walletErr || !wallet)
    throw new Error("Wallet not found or access denied");

  // 2. Dates (sorted)
  const { data: dates, error: datesErr } = await supabase
    .from("wallet_dates")
    .select("id, wallet_id, date, index, created_at")
    .eq("wallet_id", walletID)
    .order("index", { ascending: true });

  if (datesErr) throw datesErr;

  const dateIds = dates.map((d) => d.id);

  // 3. Dirs
  const { data: dirs, error: dirsErr } = await supabase
    .from("dirs")
    .select("id, wallet_id, name, description, parent_dir_id, created_at")
    .eq("wallet_id", walletID);

  if (dirsErr) throw dirsErr;

  // 4. Assets + values + transactions (nested)
  const { data: assets, error: assetsErr } = await supabase
    .from("assets")
    .select(
      `
      id,
      dir_id,
      name,
      color,
      estimated_apy,
      count_first_input,
      created_at,
      asset_values!asset_id (
        id, asset_id, date_id, value
      ),
      transactions!asset_id (
        id, asset_id, date_id, amount, type, created_at
      ),
      recurring_transactions!asset_id (
        id, asset_id, amount, period, created_at
      )
    `,
    )
    .in("asset_values.date_id", dateIds)
    .in("transactions.date_id", dateIds);

  if (assetsErr) throw assetsErr;

  // Filter assets by dir.wallet_id (security)
  const validAssetIds = new Set(
    assets
      .filter((a: any) =>
        dirs.some((d) => d.id === a.dir_id && d.wallet_id === walletID),
      )
      .map((a: any) => a.id),
  );

  const filteredAssets = assets.filter((a: any) => validAssetIds.has(a.id));

  // 5. Return raw  structure
  return {
    wallet,
    dates: dates || [],
    dirs: dirs || [],
    assets: filteredAssets.map((a: any) => ({
      ...a,
      values: a.asset_values || [],
      transactions: a.transactions || [],
      recurring_transactions: a.recurring_transactions || [],
    })),
  };
};
