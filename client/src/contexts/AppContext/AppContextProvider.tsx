import { useEffect, useState, type ReactNode } from "react";
import { AppContext } from "./AppContextHook";
import type { Asset, Directory } from "../../types/WalletTypes";
import { useWallet } from "../WalletContext/WalletContextHook";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { wallet } = useWallet();

  const [currentItem, setCurrentItem] = useState<Asset | Directory | null>(
    null,
  );

  useEffect(() => {
    if (wallet && wallet.assets.length > 0 && !currentItem) {
      console.log("TEst");
      setCurrentItem(wallet.assets[0]);
    }
  }, [wallet, currentItem]);

  return (
    <AppContext.Provider value={{ currentItem, setCurrentItem }}>
      {children}
    </AppContext.Provider>
  );
};
