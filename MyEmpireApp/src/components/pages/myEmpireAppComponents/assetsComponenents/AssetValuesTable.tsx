import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { EditableValue } from "../../../utilies/EditableValue";
import { EditableDate } from "../../../utilies/EditableDate";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";
import { AddDateButton } from "../../../utilies/AddDateButton";

export function AssetValuesTable() {
  const { portfolio, modifyPortfolio } = usePortfolio();
  const { currentAssetId } = useAssetContext();

  const currentAsset = portfolio?.assets.find(
    (asset) => asset.id === currentAssetId
  );

  if (!portfolio || !currentAsset) return null;

  const rows = portfolio.dates.map((_, index) => {
    const gain =
      index === 0
        ? null
        : currentAsset.values[index] -
          currentAsset.values[index - 1] -
          currentAsset.inputs[index];

    const percentage =
      index === 0 || currentAsset.values[index - 1] === 0
        ? null
        : (gain! / currentAsset.values[index - 1]) * 100;

    return (
      <tr key={index}>
        {/* Date */}
        <td className="text-center align-middle">
          <EditableDate index={index} />
        </td>

        {/* Value */}
        <td className="text-end align-middle">
          <EditableValue
            value={currentAsset.values[index]}
            modifyValue={(newValue) => {
              currentAsset.values[index] = newValue;
              modifyPortfolio(portfolio);
            }}
          />
        </td>

        {/* Inputs */}
        <td className="text-end align-middle">
          <EditableValue
            value={currentAsset.inputs[index]}
            modifyValue={(newValue) => {
              currentAsset.inputs[index] = newValue;
              modifyPortfolio(portfolio);
            }}
          />
        </td>

        {/* Gains */}
        <td
          className={`text-end align-middle ${
            gain != null ? (gain >= 0 ? "text-success" : "text-danger") : ""
          }`}
        >
          {gain != null ? `${gain.toFixed(2)} $` : "N/A"}
        </td>

        {/* Percentage */}
        <td
          className={`text-end align-middle ${
            percentage != null
              ? percentage >= 0
                ? "text-success"
                : "text-danger"
              : ""
          }`}
        >
          {percentage != null ? `${percentage.toFixed(2)} %` : "N/A"}
        </td>
      </tr>
    );
  });

  return (
    <Table
      size="sm"
      bordered={false}
      hover
      responsive
      className="align-middle text-nowrap"
    >
      <thead className="table-light">
        <tr>
          <th style={{ width: "20%", textAlign: "center" }}>Date</th>
          <th style={{ width: "20%", textAlign: "center" }}>Values</th>
          <th style={{ width: "20%", textAlign: "center" }}>Inputs</th>
          <th style={{ width: "20%", textAlign: "right" }}>Gains</th>
          <th style={{ width: "20%", textAlign: "right" }}>Percentage</th>
        </tr>
      </thead>
      <tbody>
        {rows}
        <tr>
          <td>
            <AddDateButton />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
