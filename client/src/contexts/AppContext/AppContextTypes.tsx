import type { Asset, Directory } from "@shared/WalletTypes";

export type AppContextType = {
  currentItem: CurrentItem;
  currentItemId: CurrentItemId;
  setCurrentItemId: (id: CurrentItemId) => void;
};

export type CurrentItemId =
  | { type: "asset"; id: number }
  | { type: "directory"; id: number }
  | null;

export type CurrentItem =
  | (Asset & { type: "asset" })
  | (Directory & { type: "directory" })
  | null;
