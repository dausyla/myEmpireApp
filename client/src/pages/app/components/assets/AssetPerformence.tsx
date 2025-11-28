import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
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
      <div className="table-responsive">
        <Table
          hover
          size="sm"
          className="asset-performance-table align-middle text-nowrap"
        >
          <thead>
            <tr>
              <th
                className="text-center py-2"
                style={{ width: "25%", border: "none" }}
              >
                <span className="fw-bold">💰 Value & Time</span>
              </th>
              <th
                className="text-center py-2"
                style={{ width: "25%", border: "none" }}
              >
                <span className="fw-bold">📥 Deposits</span>
              </th>
              <th
                className="text-center py-2"
                style={{ width: "25%", border: "none" }}
              >
                <span className="fw-bold">📤 Withdrawals</span>
              </th>
              <th
                className="text-center py-2"
                style={{ width: "25%", border: "none" }}
              >
                <span className="fw-bold">⚡ Net Flow</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Value & Time */}
              <td className="text-center align-middle py-2">
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center mb-1">
                    <span
                      className="text-muted me-2"
                      style={{ fontSize: "0.9em" }}
                    >
                      $
                    </span>
                    <span
                      className="fw-bold"
                      style={{ fontSize: "1.1em", color: "#28a745" }}
                    >
                      {totalValue.toLocaleString()}
                    </span>
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.8em" }}>
                    ⏱️ {timeSpent} days
                  </small>
                </div>
              </td>

              {/* Deposits */}
              <td className="text-center align-middle py-2">
                <div className="d-flex flex-column align-items-center">
                  <span
                    className={`fw-medium ${totalDeposit > 0 ? "text-success" : "text-muted"}`}
                    style={{ fontSize: "0.9em" }}
                  >
                    +${totalDeposit.toLocaleString()}
                  </span>
                  {totalRewards > 0 && (
                    <small
                      className="text-success"
                      style={{ fontSize: "0.7em" }}
                    >
                      +${totalRewards.toLocaleString()} rewards
                    </small>
                  )}
                </div>
              </td>

              {/* Withdrawals */}
              <td className="text-center align-middle py-2">
                <div className="d-flex flex-column align-items-center">
                  <span
                    className={`fw-medium ${totalWithdrawal > 0 ? "text-danger" : "text-muted"}`}
                    style={{ fontSize: "0.9em" }}
                  >
                    -${totalWithdrawal.toLocaleString()}
                  </span>
                  {totalFees > 0 && (
                    <small
                      className="text-warning"
                      style={{ fontSize: "0.7em" }}
                    >
                      -${totalFees.toLocaleString()} fees
                    </small>
                  )}
                </div>
              </td>

              {/* Net Flow */}
              <td className="text-center align-middle py-2">
                <div className="d-flex flex-column align-items-center">
                  <span
                    className={`fw-bold ${
                      totalDeposit - totalWithdrawal > 0
                        ? "text-success"
                        : totalDeposit - totalWithdrawal < 0
                          ? "text-danger"
                          : "text-muted"
                    }`}
                    style={{ fontSize: "1em" }}
                  >
                    {totalDeposit - totalWithdrawal >= 0 ? "+" : ""}$
                    {(totalDeposit - totalWithdrawal).toLocaleString()}
                  </span>
                  <small className="text-muted" style={{ fontSize: "0.7em" }}>
                    Net contribution
                  </small>
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* Performance Summary Card */}
      <div className="mt-2">
        <Card className="performance-summary-card shadow-sm">
          <Card.Body className="p-3">
            <div className="row g-3">
              <div className="col-6 col-md-4">
                <div className="performance-metric text-center">
                  <div className="metric-icon">📈</div>
                  <div className="metric-value text-success fw-bold">
                    {totalGrowth.toFixed(2)}%
                  </div>
                  <div className="metric-label small text-muted">
                    Total Growth
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="performance-metric text-center">
                  <div className="metric-icon">💎</div>
                  <div className="metric-value text-primary fw-bold">
                    ${totalInterests.toLocaleString()}
                  </div>
                  <div className="metric-label small text-muted">
                    Total Interests
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="performance-metric text-center">
                  <div className="metric-icon">🚀</div>
                  <div className="metric-value text-info fw-bold">
                    {apy.toFixed(2)}%
                  </div>
                  <div className="metric-label small text-muted">
                    Annual Yield
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
