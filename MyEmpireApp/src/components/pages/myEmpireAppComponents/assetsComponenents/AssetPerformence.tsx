import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { Button } from "react-bootstrap";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";

export function AssetPerformence() {
  const { portfolio, modifyPortfolio } = usePortfolio();
  const { currentAssetId } = useAssetContext();

  const currentAsset = portfolio?.assets.find(
    (asset) => asset.id === currentAssetId
  );

  if (!currentAsset || !portfolio) {
    return null;
  }

  const totalValue = currentAsset.values[currentAsset.values.length - 1]; // Last Value
  const totalInput = currentAsset.inputs.reduce((a, b) => a + b, 0);
  const totalInterests = totalValue - totalInput;
  const totalGrowth = totalValue / totalInput - 1;

  const firstDateAsset = portfolio.dates.find(
    (_, index) => currentAsset.values[index] > 0
  );

  if (!firstDateAsset) {
    return <div>No values recorded for this asset.</div>;
  }

  const timeSpentInYears =
    (portfolio.dates[portfolio.dates.length - 1] - firstDateAsset) /
    (1000 * 60 * 60 * 24 * 365);

  const apy = totalGrowth / timeSpentInYears;

  const automatePredictions = () => {
    currentAsset.prediction.monthlyInput =
      Math.round((100 * totalInput) / timeSpentInYears / 12) / 100; // Round to 2 decimals
    currentAsset.prediction.estimatedAPY = Math.round(apy * 10000) / 10000; // Round to 2 decimals
    modifyPortfolio(portfolio);
  };

  return (
    <>
      <Table hover className="align-middle ">
        <thead className="table-light">
          <tr>
            <th style={{ width: "16.6%", textAlign: "center" }}>Total Value</th>
            <th style={{ width: "16.6%", textAlign: "center" }}>Total Input</th>
            <th style={{ width: "16.6%", textAlign: "center" }}>
              Monthly Input
            </th>
            <th style={{ width: "16.6%", textAlign: "center" }}>
              Total Interests
            </th>
            <th style={{ width: "16.6%", textAlign: "center" }}>
              Total Growth
            </th>
            <th style={{ width: "16.6%", textAlign: "center" }}>APY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "right" }}>{totalValue.toFixed(2)} $</td>
            <td style={{ textAlign: "right" }}>{totalInput.toFixed(2)} $</td>
            <td style={{ textAlign: "right" }}>
              {(totalInput / timeSpentInYears / 12).toFixed(2)} $
            </td>
            <td
              style={{ textAlign: "right" }}
              className={`text-${totalInterests > 0 ? "success" : "danger"}`}
            >
              {totalInterests.toFixed(2)} $
            </td>
            <td
              style={{ textAlign: "right" }}
              className={`text-${totalGrowth > 0 ? "success" : "danger"}`}
            >
              {(100 * totalGrowth).toFixed(2)} %
            </td>
            <td
              style={{ textAlign: "right" }}
              className={`text-${apy > 0 ? "success" : "danger"}`}
            >
              {(100 * apy).toFixed(2)} %
            </td>
          </tr>
        </tbody>
      </Table>

      <div>
        <Button variant="outline-primary" onClick={automatePredictions}>
          Automate Predictions
        </Button>
      </div>
    </>
  );
}
