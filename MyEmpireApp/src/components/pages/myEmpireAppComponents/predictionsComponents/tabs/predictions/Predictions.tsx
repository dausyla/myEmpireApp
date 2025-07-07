import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../../../contexts/DataContext/PortfolioContextHook";
import { EditableValue } from "../../../../../utilies/EditableValue";

export function Predictions() {
  const { portfolio, modifyPortfolio } = usePortfolio();

  const predictionRows = portfolio.assets.map((asset) => (
    <tr key={asset.id}>
      <td>{asset.name}</td>
      <td>
        <EditableValue
          value={asset.prediction.monthlyInput}
          modifyValue={(newValue) => {
            asset.prediction.monthlyInput = newValue;
            modifyPortfolio(portfolio);
          }}
        />
      </td>
      <td>
        <EditableValue
          value={asset.prediction.estimatedAPY * 100}
          modifyValue={(newValue) => {
            asset.prediction.estimatedAPY = newValue / 100;
            modifyPortfolio(portfolio);
          }}
          suffix="%"
        />
      </td>
    </tr>
  ));

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Monthly Input</th>
          <th>Estimated APY</th>
        </tr>
      </thead>
      <tbody>{predictionRows}</tbody>
    </Table>
  );
}
