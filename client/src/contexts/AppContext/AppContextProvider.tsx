import { useEffect, useState, type ReactNode } from "react";
import { AppContext } from "./AppContextHook";
import { useWallet } from "../WalletContext/WalletContextHook";
import { useBatch } from "../BatchContext/BatchContextHook";
import type { CurrentItem, CurrentItemId } from "./AppContextTypes";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { wallet } = useWallet();
  const { resolvedIds } = useBatch();

  const [currentItemId, setCurrentItemId] = useState<CurrentItemId>(null);

  const currentItem = (() => {
    if (!wallet || currentItemId === null) return null;

    // Check if the ID has been resolved
    const id = resolvedIds[currentItemId.id] ?? currentItemId.id;

    if (currentItemId.type === "asset") {
      const a = wallet.assets.find((a) => a.id === id);
      if (a === undefined) return null;
      return { ...a, type: "asset" } as CurrentItem;
    }
    if (currentItemId.type === "directory") {
      const d = wallet.dirs.find((d) => d.id === id);
      if (d === undefined) return null;
      return { ...d, type: "directory" } as CurrentItem;
    }
    return null;
  })();

  useEffect(() => {
    if (wallet && wallet.assets.length > 0 && !currentItemId) {
      setCurrentItemId({ type: "asset", id: wallet.assets[0].id });
    }
  }, [wallet, currentItemId]);

  // Update currentItemId if it was resolved
  useEffect(() => {
    if (currentItemId && resolvedIds[currentItemId.id]) {
      setCurrentItemId({
        ...currentItemId,
        id: resolvedIds[currentItemId.id],
      });
    }
  }, [resolvedIds, currentItemId]);

  const [openedDirs, setOpenedDirs] = useState<Record<number, boolean>>({});

  const toggleDir = (id: number) => {
    setOpenedDirs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentItem,
        currentItemId,
        setCurrentItemId,
        openedDirs,
        toggleDir,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
