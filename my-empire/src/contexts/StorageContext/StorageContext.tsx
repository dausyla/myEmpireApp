import React, { useEffect, useState } from "react";
import { createContext, ReactNode } from "react";
import { StorageContextType } from "./StorageContext.type";
import { Empire } from "../../types/empire";
import { Preferences } from "@capacitor/preferences";

const emptyEmpire: Empire = {
  name: "empty",
  data: {
    funds: {},
    dates: [],
    transferts: {},
  },
};

export const StorageProvider = createContext<StorageContextType>({
  empire: emptyEmpire,
  saveEmpire: async () => {},
});

export const StorageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [empire, setEmpire] = useState<Empire>(emptyEmpire);

  const loadEmpire = async (empireName: string) => {
    const res = await Preferences.get({ key: empireName });
    if (res.value) {
      const parsed = JSON.parse(res.value);
      setEmpire(parsed);
    }
  };

  const saveEmpire = async () => {
    await Preferences.set({ key: empire.name, value: JSON.stringify(empire) });
    await Preferences.set({ key: "latest", value: empire.name });
  };

  useEffect(() => {
    Preferences.get({ key: "latestEmpire" }).then((latestEmpire) => {
      if (latestEmpire.value) {
        loadEmpire(latestEmpire.value);
      }
    });
  }, []);

  return (
    <StorageProvider.Provider
      value={{
        saveEmpire,
        empire,
      }}
    >
      {children}
    </StorageProvider.Provider>
  );
};
