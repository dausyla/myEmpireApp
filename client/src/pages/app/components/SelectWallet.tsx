// src/pages/PortfolioListPage.tsx
import { NoWallet } from "./NoWallet";
import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";

export const SelectWallet = () => {
  const { getWallet, walletList } = useWallet();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="mb-8 text-center font-bold text-3xl text-[var(--text-primary)]">
        My Portfolios
      </h1>

      {walletList === null ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[var(--brand-primary)] border-r-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {walletList.map((p) => (
              <div key={p.id}>
                <div
                  className="h-full shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 rounded-lg border border-[var(--border-color)] flex flex-col"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    cursor: "pointer",
                  }}
                  onClick={() => getWallet(p.id)}
                >
                  <div className="p-5 flex flex-col flex-grow">
                    <h5 className="text-xl font-medium mb-2 text-[var(--brand-primary)]">
                      {p.title}
                    </h5>
                    {p.description ? (
                      <p className="text-gray-500 flex-grow mb-4">
                        {p.description}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic flex-grow mb-4">
                        No description
                      </p>
                    )}
                    <button
                      className="mt-auto self-start px-3 py-1.5 text-sm border border-[var(--brand-primary)] text-[var(--brand-primary)] rounded hover:bg-[var(--brand-primary)] hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        getWallet(p.id);
                      }}
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {walletList.length === 0 && (
            <div className="text-center mt-12 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
              <p className="mb-4">No portfolios yet.</p>
              <NoWallet />
            </div>
          )}
        </>
      )}
    </div>
  );
};
