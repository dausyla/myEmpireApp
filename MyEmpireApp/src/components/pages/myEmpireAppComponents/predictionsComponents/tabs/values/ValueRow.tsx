import { usePortfolio } from "../../../../../../contexts/DataContext/PortfolioContextHook";
import { EditableValue } from "../../../../../utilies/EditableValue";

export function ValueRow({ id }: { id: number }) {
  const { portfolio, modifyPortfolio } = usePortfolio();

  const values = portfolio.assets.map((asset) => (
    <td key={asset.id}>
      <EditableValue
        value={asset.values[id]}
        modifyValue={(newValue) => {
          asset.values[id] = newValue;
          modifyPortfolio(portfolio);
        }}
      />
    </td>
  ));

  return (
    <tr>
      <td>{new Date(portfolio.dates[id]).toISOString().split("T")[0]}</td>
      {values}
    </tr>
  );
}
