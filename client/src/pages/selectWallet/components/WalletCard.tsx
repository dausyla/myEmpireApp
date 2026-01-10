import React from "react";

interface Wallet {
  id: number;
  title: string;
  description?: string;
}

interface WalletCardProps {
  wallet: Wallet;
  onSelect: (id: string) => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(String(wallet.id))}
      className="group relative overflow-hidden bg-white dark:bg-[#181b21] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-purple-500/30 hover:-translate-y-1"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-purple-500/10 p-2 rounded-full">
          <svg
            className="w-5 h-5 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-xl">
          <svg
            className="w-8 h-8 text-purple-600 dark:text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
        {wallet.title}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
        {wallet.description || "Aucune description"}
      </p>

      <div className="mt-6 flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
        Ouvrir le portefeuille
      </div>
    </div>
  );
};
