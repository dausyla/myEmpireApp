import type { Asset, Directory } from "../../types/WalletTypes";

export type AppContextType = {
  currentItem: Asset | Directory | null;
  setCurrentItem: (item: Asset | Directory | null) => void;
};
