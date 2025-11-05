import { createContext, useContext } from "react";
import type { DateContextType } from "./DateContextTypes";

export const DateContext = createContext<DateContextType>({
  addDate: () => {},
  editDate: () => {},
  deleteDate: () => {},
});

export function useDateContext() {
  return useContext(DateContext);
}
