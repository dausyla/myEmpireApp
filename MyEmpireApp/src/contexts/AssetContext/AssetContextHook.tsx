import { createContext, useContext } from "react";
import type { AssetContextType } from "./AssetContextTypes";

export const AssetContext = createContext<AssetContextType>({
  currentAsset: undefined,
  setCurrentAsset: () => {},

  getAsset: () => undefined,
  addNewAsset: () => {},
  deleteAsset: () => {},
  mapAssets: () => {},

  getDir: () => undefined,
  addNewDir: () => {},
  deleteDir: () => {},
});

export function useAssetContext() {
  return useContext(AssetContext);
}
