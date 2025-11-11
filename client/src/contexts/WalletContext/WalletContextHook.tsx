import { createContext, useContext } from "react";
import { type WalletContextType } from "./WalletContextTypes";

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
  walletList: null,
  createWallet: () => {},
  getWallet: () => {},
  getWalletList: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}
