import { Empire } from "../../types/empire";

export type StorageContextType = {
  empire: Empire;
  saveEmpire: () => Promise<void>;
};
