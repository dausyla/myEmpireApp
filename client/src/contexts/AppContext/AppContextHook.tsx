import { createContext, useContext } from "react";
import type { AppContextType } from "./AppContextTypes";

export const AppContext = createContext<AppContextType>({
  currentItem: null,
  setCurrentItem: () => {},
});

export function useApp() {
  return useContext(AppContext);
}
