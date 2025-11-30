import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import "./AssetPerformence.css";

export function AssetPerformence() {
  const { currentItemId } = useApp();
  const { getAssetPerformance } = useData();

  if (!currentItemId || currentItemId.type === "directory") return null;

  const perf = getAssetPerformance(currentItemId.id);

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
    <div className="asset-performance-container">
      {/* Row 1: Detailed Metrics */}
      <div className="row g-3 p-2 m-0">
        {/* Value */}
        <div className="col-6 col-md-3">
          <div className="performance-metric text-center">
            <div className="metric-icon">💰</div>
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center mb-0">
                <span className="text-muted me-1" style={{ fontSize: "0.8em" }}>
                  $
                </span>
                <span
                  className="fw-bold metric-value"
                  style={{ color: "#28a745" }}
                >
                  {totalValue.toLocaleString()}
                </span>
              </div>
              <div className="metric-label small text-muted">Value</div>
            </div>
          </div>
        </div>
        {/* Time */}
        <div className="col-6 col-md-3">
          <div className="performance-metric text-center">
            <div className="metric-icon">⏱️</div>
            <div className="d-flex flex-column align-items-center">
              <span
                className="fw-bold metric-value"
                style={{ color: " #61ac73ff" }}
              >
                {timeSpent.toLocaleString()} days
              </span>
              <div className="metric-label small text-muted">Time</div>
            </div>
          </div>
        </div>

        {/* Deposits */}
        <div className="col-6 col-md-3">
          <div className="performance-metric text-center">
            <div className="metric-icon">📥</div>
            <div className="d-flex flex-column align-items-center">
              <span
                className={`fw-medium metric-value ${totalDeposit > 0 ? "text-success" : "text-muted"}`}
              >
                +${totalDeposit.toLocaleString()}
              </span>
              <div className="metric-label small text-muted">Deposits</div>
              {totalRewards > 0 && (
                <small
                  className="text-success mt-1"
                  style={{ fontSize: "0.65em" }}
                >
                  +${totalRewards.toLocaleString()} rewards
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Withdrawals */}
        <div className="col-6 col-md-3">
          <div className="performance-metric text-center">
            <div className="metric-icon">📤</div>
            <div className="d-flex flex-column align-items-center">
              <span
                className={`fw-medium metric-value ${totalWithdrawal > 0 ? "text-danger" : "text-muted"}`}
              >
                -${totalWithdrawal.toLocaleString()}
              </span>
              <div className="metric-label small text-muted">Withdrawals</div>
              {totalFees > 0 && (
                <small
                  className="text-warning mt-1"
                  style={{ fontSize: "0.65em" }}
                >
                  -${totalFees.toLocaleString()} fees
                </small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-1 mx-4 opacity-10" />

      {/* Row 2: Performance Summary */}

      {/* Total Growth */}
      <div className="row g-3 m-0 p-2">
        <div className="col-6 col-md-3">
          <div className="performance-metric text-center">
            <div className="metric-icon">📈</div>
            <div className="metric-value text-success fw-bold">
              {totalGrowth.toFixed(2)}%
            </div>
            <div className="metric-label small text-muted">Total Growth</div>
          </div>
        </div>
        {/* Interests */}
        <div className="col-6 col-md-3">
          <div className="performance-metric text-center">
            <div className="metric-icon">💎</div>
            <div className="metric-value text-primary fw-bold">
              ${totalInterests.toLocaleString()}
            </div>
            <div className="metric-label small text-muted">Total Interests</div>
          </div>
        </div>
        {/* APY */}
        <div className="col-12 col-md-3">
          <div className="performance-metric text-center">
            <div className="metric-icon">🚀</div>
            <div className="metric-value text-info fw-bold">
              {apy.toFixed(2)}%
            </div>
            <div className="metric-label small text-muted">Annual Yield</div>
          </div>
        </div>
        {/* Net Flow */}
        <div className="col-6 col-md-3">
          <div className="performance-metric text-center">
            <div className="metric-icon">⚡</div>
            <div className="d-flex flex-column align-items-center">
              <span
                className={`fw-bold metric-value ${
                  totalDeposit - totalWithdrawal > 0
                    ? "text-success"
                    : totalDeposit - totalWithdrawal < 0
                      ? "text-danger"
                      : "text-muted"
                }`}
              >
                {totalDeposit - totalWithdrawal >= 0 ? "+" : ""}$
                {(totalDeposit - totalWithdrawal).toLocaleString()}
              </span>
              <div className="metric-label small text-muted">Net Flow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
