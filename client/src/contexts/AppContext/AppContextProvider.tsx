import { useEffect, useState, type ReactNode } from "react";
import { AppContext } from "./AppContextHook";
import { useWallet } from "../WalletContext/WalletContextHook";
import type { CurrentItem, CurrentItemId } from "./AppContextTypes";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { wallet } = useWallet();

  const [currentItemId, setCurrentItemId] = useState<CurrentItemId>(null);

  const currentItem = (() => {
    if (!wallet || currentItemId === null) return null;
    if (currentItemId.type === "asset") {
      const a = wallet.assets.find((a) => a.id === currentItemId.id);
      if (a === undefined) throw new Error("Couldn't find the current item");
      return { ...a, type: "asset" } as CurrentItem;
    }
    if (currentItemId.type === "directory") {
      const d = wallet.dirs.find((d) => d.id === currentItemId.id);
      if (d === undefined) throw new Error("Couldn't find the current item");
      return { ...d, type: "directory" } as CurrentItem;
    }
    return null;
  })();

  useEffect(() => {
    if (wallet && wallet.assets.length > 0 && !currentItemId) {
      setCurrentItemId({ type: "asset", id: wallet.assets[0].id });
    }
  }, [wallet, currentItemId]);

  return (
    <AppContext.Provider
      value={{ currentItem, currentItemId, setCurrentItemId }}
    >
      {children}
    </AppContext.Provider>
  );
};
