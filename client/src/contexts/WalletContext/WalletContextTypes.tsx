import type { WalletList, WalletResponse } from "../../types/WalletTypes";

export type WalletContextType = {
  wallet: WalletResponse | null;
  setWallet: React.Dispatch<React.SetStateAction<WalletResponse | null>>;
  walletList: WalletList | null;
  createWallet: (title: string, description: string) => void;
  getWalletList: () => void;
  getWallet: (walletId: number) => void;
};
