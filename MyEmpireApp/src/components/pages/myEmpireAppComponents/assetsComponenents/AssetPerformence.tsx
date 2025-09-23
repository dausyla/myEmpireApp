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
      Math.round((100 * totalInput) / timeSpentInYears / 12) / 100; // Round to 2 decimal;
    currentAsset.prediction.estimatedAPY = Math.round(apy * 100) / 100; // Round to 2 decimals
    modifyPortfolio(portfolio);
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Total Value</th>
            <th>Total Input</th>
            <th>Monthly Input</th>
            <th>Total Interests</th>
            <th>Total Growth</th>
            <th>APY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalValue.toFixed(2)} $</td>
            <td>{totalInput.toFixed(2)} $</td>
            <td>{(totalInput / timeSpentInYears / 12).toFixed(2)} $</td>
            <td>{totalInterests.toFixed(2)} $</td>
            <td>{(100 * totalGrowth).toFixed(2)} %</td>
            <td>{(100 * apy).toFixed(2)} %</td>
          </tr>
        </tbody>
      </Table>
      <Button onClick={automatePredictions}>Automate Predictions</Button>
    </>
  );
}
