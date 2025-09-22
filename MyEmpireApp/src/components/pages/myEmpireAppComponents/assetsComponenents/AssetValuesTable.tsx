import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../contexts/DataContext/PortfolioContextHook";
import { EditableValue } from "../../../utilies/EditableValue";

export function AssetValuesTable() {
  const { portfolio, editingAssetId, modifyPortfolio } = usePortfolio();

  const currentAsset = portfolio.assets.find(
    (asset) => asset.id === editingAssetId
  );

  if (!currentAsset) {
    return <div>No asset selected</div>;
  }

  const rows = portfolio.dates.map((date, index) => (
    <tr key={index}>
      <td>{new Date(date).toISOString().split("T")[0]}</td>
      {/* Value */}
      <td>
        <EditableValue
          value={currentAsset.values[index]}
          modifyValue={(newValue) => {
            currentAsset.values[index] = newValue;
            modifyPortfolio(portfolio);
          }}
        />
      </td>
      {/* Inputs */}
      <td>
        <EditableValue
          value={currentAsset.inputs[index]}
          modifyValue={(newValue) => {
            currentAsset.inputs[index] = newValue;
            modifyPortfolio(portfolio);
          }}
        />
      </td>
      {/* Gains */}
      <td>
        {index === 0
          ? "N/A"
          : (
              currentAsset.values[index] -
              currentAsset.values[index - 1] -
              currentAsset.inputs[index]
            ).toFixed(2)}
        {" $"}
      </td>
      {/* Pourcentage */}
      <td>
        {index === 0 || currentAsset.values[index - 1] === 0
          ? "N/A"
          : (
              ((currentAsset.values[index] -
                currentAsset.values[index - 1] -
                currentAsset.inputs[index]) /
                currentAsset.values[index - 1]) *
              100
            ).toFixed(2) + " %"}
      </td>
    </tr>
  ));

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Values</th>
          <th>Inputs</th>
          <th>Gains</th>
          <th>Pourcentage</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
