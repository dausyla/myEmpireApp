import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../../contexts/DataContext/PortfolioContext";
import { ValueRow } from "./ValueRow";

export function Values() {
  const { portfolio } = usePortfolio();
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
      <tbody>{valueRows}</tbody>
    </Table>
  );
}
