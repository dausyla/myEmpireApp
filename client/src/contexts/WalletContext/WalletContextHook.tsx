import { createContext, useContext } from "react";
import { type WalletContextType } from "./WalletContextTypes";

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
  walletList: null,
  createWallet: async () => {
    throw new Error("Not implemented");
  },
  getWallet: async () => {},
  getWalletList: async () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}
