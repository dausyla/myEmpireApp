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
    <Table
      bordered={false}
      hover
      className="align-middle text-nowrap shadow-sm"
    >
      <thead className="table-light">
        <tr>
          <th style={{ width: "50%", textAlign: "center" }}>Monthly Input</th>
          <th style={{ width: "50%", textAlign: "center" }}>Estimated APY</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ textAlign: "right" }}>
            <EditableValue
              value={currentAsset.prediction.monthlyInput}
              modifyValue={(newValue) => {
                currentAsset.prediction.monthlyInput = newValue;
                modifyPortfolio(portfolio);
              }}
              suffix=" $"
            />
          </td>
          <td style={{ textAlign: "right" }}>
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
