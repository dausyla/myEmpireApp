// AssetValuesTable.tsx
import Table from "react-bootstrap/Table";
import { EditableValue } from "../../../../utilies/components/EditableValue";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { AddDateButton } from "../../../../utilies/components/AddDateButton";

export function AssetValuesTable() {
  const { wallet } = useWallet();
  const { currentItem } = useApp();
  const { updateAssetValue, addAssetValue } = useBatch();
  const { getSortedDates } = useData();

  if (!wallet || !currentItem || currentItem.type === "directory") return null;

  const asset = wallet.assets.find((a) => a.id === currentItem.id);
  if (!asset) return null;

  const dates = getSortedDates();
  const valuesMap = new Map(asset.values.map((v) => [v.date_id, v]));
  // const txMap = new Map(asset.transactions.map((t) => [t.date_id, t]));

  let lastValue = 0;

  const rows = dates.map((date) => {
    const valueEntry = valuesMap.get(date.id);
    const currentValue = valueEntry?.value ?? lastValue;

    const gain = valueEntry ? valueEntry.value - lastValue : null;
    const percentage = gain !== null ? (gain / lastValue) * 100 : null;

    if (valueEntry) lastValue = currentValue;

    const transactions = asset.transactions
      .filter(
        (t) =>
          t.date_id === date.id && ["deposit", "withdrawal"].includes(t.type),
      )
      .reduce(
        (sum, t) => (t.type === "deposit" ? sum + t.amount : sum - t.amount),
        0,
      );

    const generated = asset.transactions
      .filter(
        (t) => t.date_id === date.id && ["fee", "reward"].includes(t.type),
      )
      .reduce(
        (sum, t) => (t.type === "reward" ? sum + t.amount : sum - t.amount),
        0,
      );

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

        {/* Transactions */}
        <td className="text-end align-middle">
          {transactions !== 0 ? transactions.toFixed(2) : "—"}
        </td>

        {/* Generated */}
        <td className="text-end align-middle">
          {generated !== 0 ? generated.toFixed(2) : "—"}
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
          <th className="text-center" style={{ width: "17%" }}>
            Date
          </th>
          <th className="text-center" style={{ width: "17%" }}>
            Value
          </th>
          <th className="text-center" style={{ width: "17%" }}>
            Transactions
          </th>
          <th className="text-center" style={{ width: "17%" }}>
            Generated
          </th>
          <th className="text-end" style={{ width: "16%" }}>
            Gain
          </th>
          <th className="text-end" style={{ width: "16%" }}>
            %
          </th>
        </tr>
      </thead>
      <tbody>
        {rows}
        <tr>
          <td colSpan={5}>
            <AddDateButton />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
