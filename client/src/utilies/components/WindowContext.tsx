import { createContext, useContext } from "react";

export interface WindowContextType {
  setHeaderActions: (actions: React.ReactNode) => void;
}

export const WindowContext = createContext<WindowContextType | undefined>(
  undefined,
);

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindowContext must be used within a WindowProvider");
  }
  return context;
};
