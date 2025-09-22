import { usePortfolio } from "../../../../../../contexts/DataContext/PortfolioContextHook";
import { EditableDate } from "../../../../../utilies/EditableDate";
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
      <td>
        <EditableDate index={id} />
      </td>
      {values}
    </tr>
  );
}
