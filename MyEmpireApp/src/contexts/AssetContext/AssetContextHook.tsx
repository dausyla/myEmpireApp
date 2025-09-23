import { createContext, useContext } from "react";
import type { AssetContextType } from "./AssetContextTypes";

export const AssetContext = createContext<AssetContextType>({
  currentAssetId: null,
  setCurrentAsset: () => {},
});

export function useAssetContext() {
  return useContext(AssetContext);
}
