import { createContext, useContext } from "react";
import type { AppContextType } from "./AppContextTypes";

export const AppContext = createContext<AppContextType>({
  currentItem: null,
  currentItemId: null,
  setCurrentItemId: () => {},
  openedDirs: {},
  toggleDir: () => {},
});

export function useApp() {
  return useContext(AppContext);
}
