import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../../../contexts/PortfolioContext/PortfolioContextHook";
import { InputRow } from "./InputRow";
import { AddDateButton } from "../../../../../utilies/AddDateButton";

export function Inputs() {
  const { portfolio } = usePortfolio();

  if (!portfolio) return null;

  const assetsNames = portfolio.assets.map((asset) => (
    <th key={asset.id}>{asset.name}</th>
  ));
  const inputRows = portfolio.dates.map((_, index) => (
    <InputRow key={index} id={index} />
  ));

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Date</th>
          {assetsNames}
        </tr>
      </thead>
      <tbody>
        {inputRows}
        <tr>
          <td>
            <AddDateButton />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
