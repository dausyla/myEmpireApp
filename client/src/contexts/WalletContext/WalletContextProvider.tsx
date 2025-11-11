import { useEffect, useState, type ReactNode } from "react";
import { WalletContext } from "./WalletContextHook";
import { useAuthContext } from "../AuthContext/AuthContextHook";
import { api } from "../../utilies/api/api";
import { ENDPOINTS } from "../../utilies/api/endpoints";
import toast from "react-hot-toast";
import type { WalletList, WalletResponse } from "../../types/WalletTypes";

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthContext();
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [walletList, setWalletList] = useState<WalletList | null>(null);

  const createWallet = (title: string, description?: string) => {
    if (!user?.premium && wallet) {
      toast.error(
        "You already have a wallet, upgrade your account to be able to have other ones",
      );
    }

    if (!description) description = "My wallet description.";

    api<WalletResponse>(ENDPOINTS.WALLETS.CREATE, "POST", {
      title,
      description,
    }).then(setWallet);
  };

  const getWalletList = () => {
    api<WalletList>(ENDPOINTS.WALLETS.LIST, "GET").then(setWalletList);
  };

  const getWallet = (walletId: number) => {
    api<WalletResponse>(ENDPOINTS.WALLETS.GET(`${walletId}`), "GET").then(
      setWallet,
    );
  };

  const modifyWallet = () => {
    // TODO later
  };

  // When app starts, fetch the user wallets
  useEffect(() => {
    getWalletList();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        walletList,
        createWallet,
        getWallet,
        getWalletList,
        modifyWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
