import React from "react";
import { WalletCard } from "./WalletCard";

interface Wallet {
  id: number;
  title: string;
  description?: string;
}

interface WalletListProps {
  wallets: Wallet[];
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export const WalletList: React.FC<WalletListProps> = ({
  wallets,
  onSelect,
  onCreate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
      {/* Create New Wallet Card */}
      <div
        onClick={onCreate}
        className="group flex flex-col items-center justify-center min-h-[200px] bg-gray-50 dark:bg-[#181b21]/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-purple-500 hover:bg-purple-500/5"
      >
        <div className="p-4 bg-white dark:bg-[#22262e] rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
          <svg
            className="w-8 h-8 text-gray-400 group-hover:text-purple-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
          Créer un portefeuille
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Commencer une nouvelle aventure
        </p>
      </div>

      {/* Existing Wallets */}
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} onSelect={onSelect} />
      ))}
    </div>
  );
};
