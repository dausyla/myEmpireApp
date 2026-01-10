import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../contexts/WalletContext/WalletContextHook";
import { WalletList } from "./components/WalletList";
import { CreateWalletModal } from "./components/CreateWalletModal";

export const SelectWalletPage = () => {
  const { getWallet, walletList } = useWallet();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectWallet = async (id: string) => {
    setIsSelecting(true);
    try {
      await getWallet(Number(id));
      navigate("/app");
    } catch (error) {
      console.error("Failed to select wallet", error);
      setIsSelecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] py-12 px-4 sm:px-6 lg:px-8 relative">
      {isSelecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Chargement de votre empire...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Vos Portefeuilles
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sélectionnez un portefeuille pour accéder à votre tableau de bord ou
            créez-en un nouveau pour commencer une nouvelle gestion.
          </p>
        </div>

        {walletList === null ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <WalletList
            wallets={walletList}
            onSelect={handleSelectWallet}
            onCreate={() => setIsCreateModalOpen(true)}
          />
        )}
      </div>

      <CreateWalletModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
