// AssetValuesTable.tsx
import Table from "react-bootstrap/Table";
import { EditableValue } from "../../../../utilies/components/EditableValue";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";

export function AssetValuesTable() {
  const { wallet } = useWallet();
  const { currentItem } = useApp();
  const { updateAssetValue, addAssetValue } = useBatch();

  if (!wallet || !currentItem || "wallet_id" in currentItem) return null;

  const asset = wallet.assets.find((a) => a.id === currentItem.id);
  if (!asset) return null;

  const dates = wallet.dates.sort((a, b) => a.index - b.index);
  const valuesMap = new Map(asset.values.map((v) => [v.date_id, v]));
  // const txMap = new Map(asset.transactions.map((t) => [t.date_id, t]));

  let lastValue = 0;

  const rows = dates.map((date, index) => {
    const valueEntry = valuesMap.get(date.id);
    const currentValue = valueEntry?.value ?? lastValue;
    if (valueEntry) lastValue = currentValue;

    const inputs =
      asset.transactions
        .filter(
          (t) =>
            t.date_id === date.id && ["deposit", "reward"].includes(t.type),
        )
        .reduce((sum, t) => sum + t.amount, 0) -
      asset.transactions
        .filter(
          (t) =>
            t.date_id === date.id && ["withdrawal", "fee"].includes(t.type),
        )
        .reduce((sum, t) => sum + t.amount, 0);

    const prevValue =
      index === 0
        ? null
        : (valuesMap.get(dates[index - 1].id)?.value ?? lastValue);
    const gain = prevValue !== null ? currentValue - prevValue - inputs : null;
    const percentage =
      prevValue !== null && prevValue > 0 && gain !== null
        ? (gain / prevValue) * 100
        : null;

    return (
      <tr key={date.id}>
        {/* Date */}
        <td className="text-center align-middle">
          {/* <EditableDate dateId={date.id} /> */}
          {date.date}
        </td>

        {/* Value */}
        <td className="text-end align-middle">
          {valueEntry ? (
            <EditableValue
              value={currentValue}
              modifyValue={(newValue) =>
                updateAssetValue(valueEntry.id, { value: newValue })
              }
            />
          ) : (
            <span
              className="text-muted cursor-pointer"
              onClick={() =>
                addAssetValue({
                  asset_id: asset.id,
                  date_id: date.id,
                  value: lastValue,
                })
              }
              style={{ cursor: "pointer" }}
            >
              {currentValue.toFixed(2)}
            </span>
          )}
        </td>

        {/* Inputs */}
        <td className="text-end align-middle">
          {inputs !== 0 ? inputs.toFixed(2) : "—"}
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
    <Table size="sm" hover responsive className="align-middle text-nowrap">
      <thead className="table-light">
        <tr>
          <th className="text-center" style={{ width: "20%" }}>
            Date
          </th>
          <th className="text-center" style={{ width: "20%" }}>
            Value
          </th>
          <th className="text-center" style={{ width: "20%" }}>
            Net Input
          </th>
          <th className="text-end" style={{ width: "20%" }}>
            Gain
          </th>
          <th className="text-end" style={{ width: "20%" }}>
            %
          </th>
        </tr>
      </thead>
      <tbody>
        {rows}
        <tr>
          <td colSpan={5}>AddDateButton</td>
        </tr>
      </tbody>
    </Table>
  );
}
