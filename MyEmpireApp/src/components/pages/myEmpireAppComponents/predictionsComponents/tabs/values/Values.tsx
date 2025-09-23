import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../../../contexts/PortfolioContext/PortfolioContextHook";
import { ValueRow } from "./ValueRow";
import { AddDateButton } from "../../../../../utilies/AddDateButton";

export function Values() {
  const { portfolio } = usePortfolio();

  if (!portfolio) return null;

  const assetsNames = portfolio.assets.map((asset) => (
    <th key={asset.id}>{asset.name}</th>
  ));
  const valueRows = portfolio.dates.map((_, index) => (
    <ValueRow key={index} id={index} />
  ));

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          {assetsNames}
        </tr>
      </thead>
      <tbody>
        {valueRows}
        <tr>
          <td>
            <AddDateButton />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
