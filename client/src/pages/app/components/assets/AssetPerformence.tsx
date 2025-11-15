import Table from "react-bootstrap/Table";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";

export function AssetPerformence() {
  const { currentItem } = useApp();
  const { getAssetPerformance } = useData();

  if (!currentItem || "wallet_id" in currentItem) {
    return null;
  }

  const perf = getAssetPerformance(currentItem.id);

  if (!perf) return null;

  return (
    <>
      <Table hover className="align-middle ">
        <thead className="table-light">
          <tr>
            <th style={{ textAlign: "center" }}>Total Value</th>
            <th style={{ textAlign: "center" }}>Time Spent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "right" }}>{perf.totalValue} $</td>
            <td style={{ textAlign: "right" }}>{perf.timeSpent} days</td>
          </tr>
        </tbody>
      </Table>
      <Table hover className="align-middle ">
        <thead className="table-light">
          <tr>
            <th style={{ textAlign: "center" }}>Total Deposit</th>
            <th style={{ textAlign: "center" }}>Total Withdrawal</th>
            <th style={{ textAlign: "center" }}>Total Fees</th>
            <th style={{ textAlign: "center" }}>Total Rewards</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "right" }}>{perf.totalDeposit} $</td>
            <td style={{ textAlign: "right" }}>{perf.totalWithdrawal} $</td>
            <td style={{ textAlign: "right" }}>{perf.totalFees} $</td>
            <td style={{ textAlign: "right" }}>{perf.totalRewards} $</td>
          </tr>
        </tbody>
      </Table>
      <Table hover className="align-middle ">
        <thead className="table-light">
          <tr>
            <th style={{ textAlign: "center" }}>Total Intersts</th>
            <th style={{ textAlign: "center" }}>Total Growth</th>
            <th style={{ textAlign: "center" }}>APY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "right" }}>{perf.totalInterests} $</td>
            <td style={{ textAlign: "right" }}>{perf.totalGrowth} $</td>
            <td style={{ textAlign: "right" }}>{perf.apy} $</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
