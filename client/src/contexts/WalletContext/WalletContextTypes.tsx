import type { WalletList, WalletResponse } from "../../types/WalletTypes";

export type WalletContextType = {
  wallet: WalletResponse | null;
  walletList: WalletList | null;
  modifyWallet: (portfolio: WalletResponse) => void;
  createWallet: (title: string, description: string) => void;
  getWalletList: () => void;
  getWallet: (walletId: number) => void;
};
