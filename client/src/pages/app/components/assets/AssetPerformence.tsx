import Table from "react-bootstrap/Table";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";

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
            <td style={{ textAlign: "right" }}>{totalValue} $</td>
            <td style={{ textAlign: "right" }}>{timeSpent} days</td>
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
            <td style={{ textAlign: "right" }}>{totalDeposit} $</td>
            <td style={{ textAlign: "right" }}>{totalWithdrawal} $</td>
            <td style={{ textAlign: "right" }}>{totalFees} $</td>
            <td style={{ textAlign: "right" }}>{totalRewards} $</td>
          </tr>
        </tbody>
      </Table>
      <Table hover className="align-middle ">
        <thead className="table-light">
          <tr>
            <th style={{ textAlign: "center" }}>Total Interests</th>
            <th style={{ textAlign: "center" }}>Total Growth</th>
            <th style={{ textAlign: "center" }}>APY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "right" }}>{totalInterests} $</td>
            <td style={{ textAlign: "right" }}>{totalGrowth} %</td>
            <td style={{ textAlign: "right" }}>{apy} %</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
