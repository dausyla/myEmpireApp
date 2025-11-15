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

  const createWallet = async (title: string, description?: string) => {
    if (!user?.premium && wallet) {
      toast.error(
        "You already have a wallet, upgrade your account to be able to have other ones",
      );
    }

    if (!description) description = "My wallet description.";

    await api<WalletResponse>(ENDPOINTS.WALLETS.CREATE, "POST", {
      title,
      description,
    }).then(setWallet);
  };

  const getWalletList = async () => {
    const wl = await api<WalletList>(ENDPOINTS.WALLETS.LIST, "GET");
    setWalletList(wl);
  };

  const getWallet = async (walletId: number) => {
    const w = await api<WalletResponse>(ENDPOINTS.WALLETS.GET(walletId), "GET");
    setWallet(w);
  };

  // When app starts, fetch the user wallets
  useEffect(() => {
    getWalletList();
  }, []);

  // If found a wallet list but no wallet selected, select first one
  useEffect(() => {
    if (walletList && !wallet && walletList.length > 0) {
      getWallet(walletList[0].id);
    }
  }, [walletList]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        walletList,
        createWallet,
        getWallet,
        getWalletList,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
