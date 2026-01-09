import { EditableValue } from "../../../../utilies/components/EditableValue";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { AddDateButton } from "../../../../utilies/components/AddDateButton";
import { EditableDate } from "../../../../utilies/components/EditableDate";

export function ItemValues() {
  const { wallet } = useWallet();
  const { currentItem } = useApp();
  const { updateAssetValue, addAssetValue } = useBatch();
  const {
    getSortedDates,
    getSortedTransactions,
    getDirectoryPerformancePerDates,
  } = useData();

  if (!wallet || !currentItem) return null;

  const dates = getSortedDates();
  let rows: JSX.Element[] = [];

  if (currentItem.type === "asset") {
    const asset = wallet.assets.find((a) => a.id === currentItem.id);
    if (!asset) return null;

    const valuesMap = new Map(asset.values.map((v) => [v.date_id, v]));
    const transactions = getSortedTransactions(asset);

    let lastValue = 0;

    rows = dates.map((date) => {
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
          className={`transition-colors border-b border-[var(--border-color)] hover:bg-[var(--bg-surface-secondary)] ${
            hasTransactions ? "bg-red-500/5 hover:bg-red-500/10" : ""
          } ${valueEntry ? "font-semibold" : ""}`}
        >
          {/* Date */}
          <td className="text-center align-middle py-1 px-2 text-xs">
            <div className="flex flex-col items-center">
              <EditableDate dateId={date.id} currentDate={date.date} />
              {hasTransactions && (
                <span className="mt-1 inline-flex items-center px-1 py-0.5 rounded text-[0.6em] font-medium bg-blue-100 text-blue-800">
                  Activity
                </span>
              )}
            </div>
          </td>

          {/* Value */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <div className="flex items-center justify-end">
              <span className="mr-1 text-[var(--text-secondary)]">$</span>
              {valueEntry ? (
                <EditableValue
                  value={currentValue}
                  modifyValue={(newValue) =>
                    updateAssetValue(valueEntry.id, { value: newValue })
                  }
                />
              ) : (
                <span
                  className="text-[var(--text-secondary)] cursor-pointer select-none px-1.5 py-px rounded border border-dashed border-[var(--border-color)] hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-colors"
                  onClick={() =>
                    addAssetValue({
                      asset_id: asset.id,
                      date_id: date.id,
                      value: lastValue,
                    })
                  }
                  title="Click to add value"
                >
                  {currentValue.toFixed(2)}
                </span>
              )}
            </div>
          </td>

          {/* Gains */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <span
              className={`font-bold ${gain != null ? (gain > 0 ? "text-green-500" : gain < 0 ? "text-red-500" : "text-[var(--text-secondary)]") : "text-[var(--text-secondary)]"}`}
            >
              {gain != null ? (
                <>
                  <span className="mr-1">{gain >= 0 ? "+" : ""}</span>$
                  {Math.abs(gain).toFixed(2)}
                </>
              ) : (
                <span>N/A</span>
              )}
            </span>
          </td>

          {/* Percentage */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <span
              className={`font-bold ${percentage != null ? (percentage > 0 ? "text-green-500" : percentage < 0 ? "text-red-500" : "text-[var(--text-secondary)]") : "text-[var(--text-secondary)]"}`}
            >
              {percentage != null ? (
                <>
                  <span className="mr-1">{percentage >= 0 ? "+" : ""}</span>
                  {Math.abs(percentage).toFixed(2)}%
                </>
              ) : (
                <span>N/A</span>
              )}
            </span>
          </td>

          {/* Transactions */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <div className="flex items-center justify-end">
              <span
                className={`font-medium ${transactionAmount >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {transactionAmount !== 0 ? (
                  <>
                    <span className="mr-1">
                      {transactionAmount >= 0 ? "+" : ""}
                    </span>
                    ${Math.abs(transactionAmount).toFixed(2)}
                  </>
                ) : (
                  <span className="text-[var(--text-secondary)]">—</span>
                )}
              </span>
              {dateTransactions.length > 0 && (
                <span className="ml-2 inline-flex items-center px-1 py-0.5 rounded text-[0.6em] font-medium bg-gray-100 text-gray-800">
                  {dateTransactions.length}
                </span>
              )}
            </div>
          </td>

          {/* Generated */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <div className="flex items-center justify-end">
              <span
                className={`font-medium ${generatedAmount >= 0 ? "text-green-500" : "text-yellow-500"}`}
              >
                {generatedAmount !== 0 ? (
                  <>
                    <span className="mr-1">
                      {generatedAmount >= 0 ? "+" : ""}
                    </span>
                    ${Math.abs(generatedAmount).toFixed(2)}
                  </>
                ) : (
                  <span className="text-[var(--text-secondary)]">—</span>
                )}
              </span>
              {dateGenerated.length > 0 && (
                <span className="ml-2 inline-flex items-center px-1 py-0.5 rounded text-[0.6em] font-medium bg-gray-100 text-gray-800">
                  {dateGenerated.length}
                </span>
              )}
            </div>
          </td>
        </tr>
      );
    });
  } else {
    // Directory
    const perfPerDate = getDirectoryPerformancePerDates(currentItem.id);
    let lastValue = 0;

    rows = dates.map((date) => {
      const perf = perfPerDate[date.id];
      const currentValue = perf ? perf.value : lastValue;
      if (perf) lastValue = currentValue;

      // Calculate gain from previous date (not strictly correct if dates are skipped, but consistent with asset logic)
      // Actually, for directory, we don't have "valueEntry" concept.
      // We can calculate gain based on previous date's value.
      // But we need to track previous value in the loop.
      // Wait, `lastValue` tracks it.
      // But `perf` exists for every date (initialized to 0s in getDirectoryPerformancePerDates).
      // So `currentValue` is always available.

      // We need previous value to calculate gain.
      // Let's use a separate variable for previous value before update.
      // But `lastValue` is updated after gain calc in asset logic.
      // Here `perf` is available for all dates.
      // But `perf.value` might be 0 if no assets? No, it's sum of assets.
      // If assets have no value for that date, it uses their last value.
      // So `perf.value` is the correct aggregated value.

      // We need the value of the PREVIOUS date in the list to calculate gain.
      // The `dates` array is sorted.
      // So we can just look at `perfPerDate[dates[i-1].id]`.
      // But `dates.map` doesn't give easy access to previous element's value if we are just iterating.
      // We can use a variable outside map.

      // Re-using lastValue logic:
      // In asset logic: `gain = valueEntry ? valueEntry.value - lastValue : 0`.
      // `lastValue` is updated `if (valueEntry) lastValue = currentValue`.
      // So `lastValue` holds the value of the last *recorded* entry.
      // For directory, we have a value for *every* date (computed).
      // So `lastValue` is just the value of the previous date.

      // However, `getDirectoryPerformancePerDates` returns 0 for value if no assets have value?
      // `getAssetPerformancePerDates` carries over last value.
      // So `getDirectoryPerformancePerDates` sums carried over values.
      // So `perf.value` is always the total value at that date.

      // So gain = currentValue - previousValue.
      // We need to initialize `lastValue` correctly.
      // If it's the first date, gain is 0 (or N/A).

      // Let's use a variable `prevValue` initialized to 0.
      // But wait, `lastValue` in asset logic is initialized to 0.

      const prevValue = lastValue;
      lastValue = currentValue;

      const gain = currentValue - prevValue;
      const percentage = prevValue !== 0 ? (gain / prevValue) * 100 : 0;

      // Transactions
      const transactionAmount =
        (perf?.deposits || 0) - (perf?.withdrawals || 0);
      const generatedAmount = (perf?.rewards || 0) - (perf?.fees || 0);
      const hasTransactions = transactionAmount !== 0 || generatedAmount !== 0; // Simplified check

      return (
        <tr
          key={date.id}
          className={`transition-colors border-b border-[var(--border-color)] hover:bg-[var(--bg-surface-secondary)] ${
            hasTransactions ? "bg-red-500/5 hover:bg-red-500/10" : ""
          }`}
        >
          {/* Date */}
          <td className="text-center align-middle py-1 px-2 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-[var(--text-primary)]">{date.date}</span>
              {hasTransactions && (
                <span className="mt-1 inline-flex items-center px-1 py-0.5 rounded text-[0.6em] font-medium bg-blue-100 text-blue-800">
                  Activity
                </span>
              )}
            </div>
          </td>

          {/* Value */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <div className="flex items-center justify-end">
              <span className="mr-1 text-[var(--text-secondary)]">$</span>
              <span className="font-semibold">{currentValue.toFixed(2)}</span>
            </div>
          </td>

          {/* Gains */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <span
              className={`font-bold ${gain > 0 ? "text-green-500" : gain < 0 ? "text-red-500" : "text-[var(--text-secondary)]"}`}
            >
              <span className="mr-1">{gain >= 0 ? "+" : ""}</span>$
              {Math.abs(gain).toFixed(2)}
            </span>
          </td>

          {/* Percentage */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <span
              className={`font-bold ${percentage > 0 ? "text-green-500" : percentage < 0 ? "text-red-500" : "text-[var(--text-secondary)]"}`}
            >
              <span className="mr-1">{percentage >= 0 ? "+" : ""}</span>
              {Math.abs(percentage).toFixed(2)}%
            </span>
          </td>

          {/* Transactions */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <div className="flex items-center justify-end">
              <span
                className={`font-medium ${transactionAmount >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {transactionAmount !== 0 ? (
                  <>
                    <span className="mr-1">
                      {transactionAmount >= 0 ? "+" : ""}
                    </span>
                    ${Math.abs(transactionAmount).toFixed(2)}
                  </>
                ) : (
                  <span className="text-[var(--text-secondary)]">—</span>
                )}
              </span>
            </div>
          </td>

          {/* Generated */}
          <td className="text-right align-middle py-1 px-2 text-xs">
            <div className="flex items-center justify-end">
              <span
                className={`font-medium ${generatedAmount >= 0 ? "text-green-500" : "text-yellow-500"}`}
              >
                {generatedAmount !== 0 ? (
                  <>
                    <span className="mr-1">
                      {generatedAmount >= 0 ? "+" : ""}
                    </span>
                    ${Math.abs(generatedAmount).toFixed(2)}
                  </>
                ) : (
                  <span className="text-[var(--text-secondary)]">—</span>
                )}
              </span>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="flex flex-col h-full p-2.5">
      <div className="overflow-auto flex-grow">
        <table className="w-full text-xs text-left text-[var(--text-primary)] border-collapse">
          <thead className="text-xs uppercase bg-[var(--bg-surface-primary)] text-[var(--text-primary)] sticky top-0 z-10">
            <tr>
              <th className="py-2 px-2 text-center font-bold border-b border-[var(--border-color)] w-[16%]">
                📅 Date
              </th>
              <th className="py-2 px-2 text-center font-bold border-b border-[var(--border-color)] w-[17%]">
                💰 Value
              </th>
              <th className="py-2 px-2 text-center font-bold border-b border-[var(--border-color)] w-[16%]">
                📈 Gain
              </th>
              <th className="py-2 px-2 text-center font-bold border-b border-[var(--border-color)] w-[17%]">
                📊 %
              </th>
              <th className="py-2 px-2 text-center font-bold border-b border-[var(--border-color)] w-[17%]">
                💸 Transactions
              </th>
              <th className="py-2 px-2 text-center font-bold border-b border-[var(--border-color)] w-[17%]">
                ⚡ Generated
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>

      <div className="mt-2 flex justify-center">
        <div className="min-w-[200px] border border-dashed border-[var(--border-color)] bg-[var(--bg-surface-secondary)] rounded-md p-2">
          <small className="block text-center text-[var(--text-secondary)] mb-2 text-[0.7rem]">
            📅 Add New Date
          </small>
          <AddDateButton />
        </div>
      </div>
    </div>
  );
}
