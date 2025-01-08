import { useContext } from "react";
import { StorageProvider } from "./StorageContext";

export const useStorageContext = () => {
  return useContext(StorageProvider);
};
