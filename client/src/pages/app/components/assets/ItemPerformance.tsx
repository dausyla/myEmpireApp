import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
export function ItemPerformance() {
  const { currentItemId } = useApp();
  const { getAssetPerformance, getDirectoryPerformance } = useData();

  if (!currentItemId) return null;

  const perf =
    currentItemId.type === "asset"
      ? getAssetPerformance(currentItemId.id)
      : getDirectoryPerformance(currentItemId.id);

  const totalValue = perf ? perf.totalValue : 0;
  const timeSpent = perf ? perf.timeSpent : 0;
  const totalDeposit = perf ? perf.totalDeposit : 0;
  const totalWithdrawal = perf ? perf.totalWithdrawal : 0;
  const totalFees = perf ? perf.totalFees : 0;
  const totalRewards = perf ? perf.totalRewards : 0;
  const totalGrowth = perf ? perf.totalGrowth : 0;
  const totalInterests = perf ? perf.totalInterests : 0;
  const apy = perf ? perf.apy : 0;

  return (
    <div className="flex flex-col h-full p-[5px]">
      {/* Row 1: Detailed Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2 m-0">
        {/* Value */}
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-[1.2rem] mb-[2px]">💰</div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-0">
                <span className="text-(--text-secondary) mr-1 text-[0.8em]">
                  $
                </span>
                <span
                  className="font-bold text-[0.9rem]"
                  style={{ color: "#28a745" }}
                >
                  {totalValue.toLocaleString()}
                </span>
              </div>
              <div className="text-[0.65rem] text-(--text-secondary)">
                Value
              </div>
            </div>
          </div>
        </div>
        {/* Time */}
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-[1.2rem] mb-[2px]">⏱️</div>
            <div className="flex flex-col items-center">
              <span
                className="font-bold text-[0.9rem]"
                style={{ color: " #61ac73ff" }}
              >
                {timeSpent.toLocaleString()} days
              </span>
              <div className="text-[0.65rem] text-(--text-secondary)">Time</div>
            </div>
          </div>
        </div>

        {/* Deposits */}
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-[1.2rem] mb-[2px]">📥</div>
            <div className="flex flex-col items-center">
              <span
                className={`font-medium text-[0.9rem] ${totalDeposit > 0 ? "text-green-500" : "text-(--text-secondary)"}`}
              >
                +${totalDeposit.toLocaleString()}
              </span>
              <div className="text-[0.65rem] text-(--text-secondary)">
                Deposits
              </div>
              {totalRewards > 0 && (
                <small className="text-green-500 mt-1 text-[0.65em]">
                  +${totalRewards.toLocaleString()} rewards
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Withdrawals */}
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-[1.2rem] mb-[2px]">📤</div>
            <div className="flex flex-col items-center">
              <span
                className={`font-medium text-[0.9rem] ${totalWithdrawal > 0 ? "text-red-500" : "text-(--text-secondary)"}`}
              >
                -${totalWithdrawal.toLocaleString()}
              </span>
              <div className="text-[0.65rem] text-(--text-secondary)">
                Withdrawals
              </div>
              {totalFees > 0 && (
                <small className="text-yellow-500 mt-1 text-[0.65em]">
                  -${totalFees.toLocaleString()} fees
                </small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-1 mx-4 opacity-10 border-(--border-color)" />

      {/* Row 2: Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 m-0 p-2">
        {/* Total Growth */}
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-[1.2rem] mb-[2px]">📈</div>
            <div className="text-green-500 font-bold text-[0.9rem]">
              {totalGrowth.toFixed(2)}%
            </div>
            <div className="text-[0.65rem] text-(--text-secondary)">
              Total Growth
            </div>
          </div>
        </div>
        {/* Interests */}
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-[1.2rem] mb-[2px]">💎</div>
            <div className="text-blue-500 font-bold text-[0.9rem]">
              ${totalInterests.toLocaleString()}
            </div>
            <div className="text-[0.65rem] text-(--text-secondary)">
              Total Interests
            </div>
          </div>
        </div>
        {/* APY */}
        <div className="col-span-2 md:col-span-1">
          <div className="text-center">
            <div className="text-[1.2rem] mb-[2px]">🚀</div>
            <div className="text-cyan-500 font-bold text-[0.9rem]">
              {apy.toFixed(2)}%
            </div>
            <div className="text-[0.65rem] text-(--text-secondary)">
              Annual Yield
            </div>
          </div>
        </div>
        {/* Net Flow */}
        <div className="col-span-1">
          <div className="text-center">
            <div className="text-[1.2rem] mb-[2px]">⚡</div>
            <div className="flex flex-col items-center">
              <span
                className={`font-bold text-[0.9rem] ${
                  totalDeposit - totalWithdrawal > 0
                    ? "text-green-500"
                    : totalDeposit - totalWithdrawal < 0
                      ? "text-red-500"
                      : "text-(--text-secondary)"
                }`}
              >
                {totalDeposit - totalWithdrawal >= 0 ? "+" : ""}$
                {(totalDeposit - totalWithdrawal).toLocaleString()}
              </span>
              <div className="text-[0.65rem] text-(--text-secondary)">
                Net Flow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
