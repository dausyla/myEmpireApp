import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../contexts/DataContext/PortfolioContextHook";
import { EditableValue } from "../../../utilies/EditableValue";

export function AssetPredictions() {
  const { portfolio, editingAssetId, modifyPortfolio } = usePortfolio();

  const currentAsset = portfolio.assets.find(
    (asset) => asset.id === editingAssetId
  );

  if (!currentAsset) {
    return <div>No asset selected</div>;
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Monthly Input</th>
          <th>Estimated APY</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <EditableValue
              value={currentAsset.prediction.monthlyInput}
              modifyValue={(newValue) => {
                currentAsset.prediction.monthlyInput = newValue;
                modifyPortfolio(portfolio);
              }}
            />
          </td>
          <td>
            <EditableValue
              value={100 * currentAsset.prediction.estimatedAPY}
              modifyValue={(newValue) => {
                currentAsset.prediction.estimatedAPY = newValue / 100;
                modifyPortfolio(portfolio);
              }}
              suffix=" %"
            />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
