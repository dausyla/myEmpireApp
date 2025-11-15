import type { WalletList, WalletResponse } from "../../types/WalletTypes";

export type WalletContextType = {
  wallet: WalletResponse | null;
  setWallet: React.Dispatch<React.SetStateAction<WalletResponse | null>>;
  walletList: WalletList | null;
  createWallet: (title: string, description: string) => Promise<void>;
  getWalletList: () => Promise<void>;
  getWallet: (walletId: number) => Promise<void>;
};
