import { usePortfolio } from "../../../../../../contexts/PortfolioContext/PortfolioContextHook";
import { EditableDate } from "../../../../../utilies/EditableDate";
import { EditableValue } from "../../../../../utilies/EditableValue";

export function InputRow({ id }: { id: number }) {
  const { portfolio, modifyPortfolio } = usePortfolio();

  if (!portfolio) return null;

  const inputs = portfolio.assets.map((asset) => (
    <td key={asset.id}>
      <EditableValue
        value={asset.inputs[id]}
        modifyValue={(newValue) => {
          asset.inputs[id] = newValue;
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
      {inputs}
    </tr>
  );
}
