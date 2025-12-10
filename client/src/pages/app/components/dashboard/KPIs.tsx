import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";

export function KPIs() {
  const { wallet } = useWallet();
  const { getAssetPerformance } = useData();

  if (!wallet) return null;

  let totalValue = 0;
  let totalInput = 0;
  let totalInterests = 0;

  wallet.assets.forEach((asset) => {
    const perf = getAssetPerformance(asset.id);
    if (perf) {
      totalValue += perf.totalValue;
      totalInput += perf.totalDeposit; // Assuming Input means total deposits
      totalInterests += perf.totalInterests;
    }
  });

  const apy = (
    totalInput > 0 ? (totalInterests / totalInput) * 100 : 0
  ).toFixed(2);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-center border-0">
            <div className="p-0">
              <div className="text-[var(--text-secondary)] mb-1 font-medium">
                Total Value
              </div>
              <h4 className="text-xl font-bold text-[var(--text-primary)]">
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                $
              </h4>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center border-0">
            <div className="p-0">
              <div className="text-[var(--text-secondary)] mb-1 font-medium">
                Total Input
              </div>
              <h4 className="text-xl font-bold text-[var(--text-primary)]">
                {totalInput.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                $
              </h4>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center border-0">
            <div className="p-0">
              <div className="text-[var(--text-secondary)] mb-1 font-medium">
                Total Interests
              </div>
              <h4 className="text-xl font-bold text-green-500">
                {totalInterests.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                $
              </h4>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center border-0">
            <div className="p-0">
              <div className="text-[var(--text-secondary)] mb-1 font-medium">
                APY
              </div>
              <h4 className="text-xl font-bold text-blue-500">{apy} %</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
