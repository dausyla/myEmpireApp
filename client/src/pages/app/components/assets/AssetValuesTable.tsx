// AssetValuesTable.tsx
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import { EditableValue } from "../../../../utilies/components/EditableValue";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { AddDateButton } from "../../../../utilies/components/AddDateButton";
import "./AssetValuesTable.css";

export function AssetValuesTable() {
  const { wallet } = useWallet();
  const { currentItem } = useApp();
  const { updateAssetValue, addAssetValue } = useBatch();
  const { getSortedDates, getSortedTransactions } = useData();

  if (!wallet || !currentItem || currentItem.type === "directory") return null;

  const asset = wallet.assets.find((a) => a.id === currentItem.id);
  if (!asset) return null;

  const dates = getSortedDates();
  const valuesMap = new Map(asset.values.map((v) => [v.date_id, v]));
  const transactions = getSortedTransactions(asset);

  let lastValue = 0;

  const rows = dates.map((date) => {
    const valueEntry = valuesMap.get(date.id);
    const currentValue = valueEntry?.value ?? lastValue;

    const gain = valueEntry ? valueEntry.value - lastValue : 0;
    const percentage = gain !== null ? (gain / lastValue) * 100 : null;

    if (valueEntry) lastValue = currentValue;

    // Calculate transactions for this date (deposits/withdrawals)
    const dateTransactions = transactions.filter(
      (t) =>
        t.date_id === date.id && ["deposit", "withdrawal"].includes(t.type),
    );
    const transactionAmount = dateTransactions.reduce(
      (sum, t) => (t.type === "deposit" ? sum + t.amount : sum - t.amount),
      0,
    );

    // Calculate generated amounts for this date (fees/rewards)
    const dateGenerated = transactions.filter(
      (t) => t.date_id === date.id && ["fee", "reward"].includes(t.type),
    );
    const generatedAmount = dateGenerated.reduce(
      (sum, t) => (t.type === "reward" ? sum + t.amount : sum - t.amount),
      0,
    );

    const hasTransactions =
      dateTransactions.length > 0 || dateGenerated.length > 0;

    return (
      <tr
        key={date.id}
        className={`${hasTransactions ? "table-info" : ""} ${valueEntry ? "fw-semibold" : ""}`}
        style={{
          backgroundColor: hasTransactions
            ? "rgba(13, 110, 253, 0.05)"
            : undefined,
          borderLeft: hasTransactions ? "3px solid #0d6efd" : undefined,
        }}
      >
        {/* Date */}
        <td className="text-center align-middle py-2">
          <div className="d-flex flex-column align-items-center">
            <span className="fw-medium" style={{ fontSize: "0.9em" }}>
              {date.date.replace(/-/g, "/")}
            </span>
            {hasTransactions && (
              <Badge
                bg="primary"
                className="mt-1"
                style={{ fontSize: "0.6em", padding: "2px 4px" }}
              >
                Activity
              </Badge>
            )}
          </div>
        </td>

        {/* Value */}
        <td className="text-end align-middle py-2">
          <div className="d-flex align-items-center justify-content-end">
            <span className="me-1 text-muted" style={{ fontSize: "0.9em" }}>
              $
            </span>
            {valueEntry ? (
              <EditableValue
                value={currentValue}
                modifyValue={(newValue) =>
                  updateAssetValue(valueEntry.id, { value: newValue })
                }
              />
            ) : (
              <span
                className="text-muted cursor-pointer user-select-none asset-value-placeholder"
                onClick={() =>
                  addAssetValue({
                    asset_id: asset.id,
                    date_id: date.id,
                    value: lastValue,
                  })
                }
                title="Click to add value"
                style={{ fontSize: "0.9em" }}
              >
                {currentValue.toFixed(2)}
              </span>
            )}
          </div>
        </td>

        {/* Gains */}
        <td className="text-end align-middle py-2">
          <span
            className={`fw-bold ${gain != null ? (gain > 0 ? "text-success" : gain < 0 ? "text-danger" : "text-muted") : "text-muted"}`}
            style={{ fontSize: "0.9em" }}
          >
            {gain != null ? (
              <>
                <span className="me-1">{gain >= 0 ? "+" : ""}</span>$
                {Math.abs(gain).toFixed(2)}
              </>
            ) : (
              <span>N/A</span>
            )}
          </span>
        </td>

        {/* Percentage */}
        <td className="text-end align-middle py-2">
          <span
            className={`fw-bold ${percentage != null ? (percentage > 0 ? "text-success" : percentage < 0 ? "text-danger" : "text-muted") : "text-muted"}`}
            style={{ fontSize: "0.9em" }}
          >
            {percentage != null ? (
              <>
                <span className="me-1">{percentage >= 0 ? "+" : ""}</span>
                {Math.abs(percentage).toFixed(2)}%
              </>
            ) : (
              <span>N/A</span>
            )}
          </span>
        </td>

        {/* Transactions */}
        <td className="text-end align-middle py-2">
          <div className="d-flex align-items-center justify-content-end">
            <span
              className={`fw-medium ${transactionAmount >= 0 ? "text-success" : "text-danger"}`}
              style={{ fontSize: "0.9em" }}
            >
              {transactionAmount !== 0 ? (
                <>
                  <span className="me-1">
                    {transactionAmount >= 0 ? "+" : ""}
                  </span>
                  ${Math.abs(transactionAmount).toFixed(2)}
                </>
              ) : (
                <span className="text-muted">—</span>
              )}
            </span>
            {dateTransactions.length > 0 && (
              <Badge
                bg="light"
                text="dark"
                className="ms-2"
                style={{ fontSize: "0.6em", padding: "1px 3px" }}
              >
                {dateTransactions.length}
              </Badge>
            )}
          </div>
        </td>

        {/* Generated */}
        <td className="text-end align-middle py-2">
          <div className="d-flex align-items-center justify-content-end">
            <span
              className={`fw-medium ${generatedAmount >= 0 ? "text-success" : "text-warning"}`}
              style={{ fontSize: "0.9em" }}
            >
              {generatedAmount !== 0 ? (
                <>
                  <span className="me-1">
                    {generatedAmount >= 0 ? "+" : ""}
                  </span>
                  ${Math.abs(generatedAmount).toFixed(2)}
                </>
              ) : (
                <span className="text-muted">—</span>
              )}
            </span>
            {dateGenerated.length > 0 && (
              <Badge
                bg="light"
                text="dark"
                className="ms-2"
                style={{ fontSize: "0.6em", padding: "1px 3px" }}
              >
                {dateGenerated.length}
              </Badge>
            )}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="asset-values-table-container">
      <div className="table-responsive flex-grow-1">
        <Table
          hover
          size="sm"
          className="asset-values-table align-middle text-nowrap"
        >
          <thead>
            <tr>
              <th
                className="text-center py-2"
                style={{ width: "16%", border: "none" }}
              >
                <span className="fw-bold ">📅 Date</span>
              </th>
              <th
                className="text-center py-2"
                style={{ width: "17%", border: "none" }}
              >
                <span className="fw-bold ">💰 Value</span>
              </th>
              <th
                className="text-center py-2"
                style={{ width: "16%", border: "none" }}
              >
                <span className="fw-bold ">📈 Gain</span>
              </th>
              <th
                className="text-center py-2"
                style={{ width: "17%", border: "none" }}
              >
                <span className="fw-bold ">📊 %</span>
              </th>
              <th
                className="text-center py-2"
                style={{ width: "17%", border: "none" }}
              >
                <span className="fw-bold ">💸 Transactions</span>
              </th>
              <th
                className="text-center py-2"
                style={{ width: "17%", border: "none" }}
              >
                <span className="fw-bold ">⚡ Generated</span>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>

      <div className="mt-2 d-flex justify-content-center">
        <div className="add-date-section">
          <small className="d-block text-center text-muted mb-2">
            📅 Add New Date
          </small>
          <AddDateButton />
        </div>
      </div>
    </div>
  );
}
