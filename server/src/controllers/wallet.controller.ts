import { Request, Response } from 'express';
import { supabase } from '../db/supabase';
import { BatchChange } from '../types';

export const batchUpdate = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const { changes, userId } = req.body as { changes: BatchChange[]; userId: string };

  // Vérifie que le wallet appartient à l'user
  const { data: wallet } = await supabase
    .from('wallets')
    .select()
    .eq('id', walletId)
    .eq('user_id', userId)
    .single();

  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

  const client = supabase; // transaction implicite via batch

  try {
    for (const change of changes) {
      if (change.type === 'update_value') {
        const { assetId, dateIndex, value } = change;

        const { data: dateRow } = await client
          .from('wallet_dates')
          .select('id')
          .eq('wallet_id', walletId)
          .eq('index', dateIndex)
          .single();

        if (!dateRow) continue;

        await client
          .from('asset_values')
          .upsert(
            { asset_id: assetId, date_id: dateRow.id, value },
            { onConflict: 'asset_id,date_id' }
          );
      }

      if (change.type === 'add_transaction') {
        const { assetId, dateIndex, amount, transType } = change;

        const { data: dateRow } = await client
          .from('wallet_dates')
          .select('id')
          .eq('wallet_id', walletId)
          .eq('index', dateIndex)
          .single();

        if (!dateRow) continue;

        await client.from('transactions').insert({
          asset_id: assetId,
          date_id: dateRow.id,
          amount,
          type: transType,
        });
      }

        if (change.type === 'add_date') {
        const { date, index } = change;

        // Appelle la fonction SQL
        const { data, error } = await client
            .rpc('insert_wallet_date', {
            p_wallet_id: Number(walletId),
            p_date: date,
            p_index: index ?? null,
            });

        if (error) {
            console.error('Error inserting date:', error);
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