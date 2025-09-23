import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { EditableValue } from "../../../utilies/EditableValue";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";

export function AssetPredictions() {
  const { portfolio, modifyPortfolio } = usePortfolio();

  const { currentAssetId } = useAssetContext();

  const currentAsset = portfolio?.assets.find(
    (asset) => asset.id === currentAssetId
  );

  if (!portfolio || !currentAsset) return null;

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
