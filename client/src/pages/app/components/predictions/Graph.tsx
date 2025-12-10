import { Line } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/WalletContext/WalletContextHook";
import { useState } from "react";
import {
  getDates,
  getDirectoryPredictions,
  graphOptions,
  type Prediction,
} from "./predictionUtils";
import {
  getColorString,
  getFadedColor,
} from "../../../../utilies/utilsFunctions";

export function Graphs() {
  const { portfolio } = usePortfolio();

  const [overYears, setOverYears] = useState(2);
  const [detailPrediction, setDetailPrediction] = useState(false);

  if (!portfolio) return null;

  const onYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = Number(value);
    e.target.value = parsedValue.toString(); // Ensure the input field shows a valid number
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      if (parsedValue > 99) {
        setOverYears(99);
      } else {
        setOverYears(parsedValue);
      }
    } else {
      setOverYears(0);
    }
  };

  const assetsPredictions: Prediction[] = getDirectoryPredictions(
    portfolio.root,
    overYears,
  );

  type Dataset = {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: "-1" | true;
  };

  const data = {
    labels: getDates(portfolio.dates, overYears).map(
      (date) => new Date(date).toISOString().split("T")[0],
    ),
    datasets: assetsPredictions.reduce(
      (acc: Dataset[], ap: Prediction, i: number) => {
        if (detailPrediction) {
          acc.push({
            label: ap.name + " - Inputs",
            data: ap.inputs,
            borderColor: getColorString(ap.color),
            backgroundColor: getFadedColor(ap.color),
            fill: i === 0 ? true : "-1",
          });
          acc.push({
            label: ap.name + " - Interests",
            data: ap.interests,
            borderColor: getColorString(ap.color),
            backgroundColor: getFadedColor(ap.color),
            fill: "-1",
          });
        } else {
          acc.push({
            label: ap.name,
            data: ap.totalValues,
            borderColor: getColorString(ap.color),
            backgroundColor: getFadedColor(ap.color),
            fill: i === 0 ? true : "-1",
          });
        }
        return acc;
      },
      [] as Dataset[],
    ),
  };

  return (
    <div
      className="rounded shadow-sm p-4 h-full flex flex-col"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span
            className="px-3 py-2 border border-r-0 rounded-l-md text-sm"
            style={{
              backgroundColor: "var(--bg-surface-secondary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            Prediction over
          </span>
          <input
            type="number"
            onChange={onYearsChange}
            value={overYears}
            className="w-20 px-3 py-2 border text-center focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
          <span
            className="px-3 py-2 border border-l-0 rounded-r-md text-sm"
            style={{
              backgroundColor: "var(--bg-surface-secondary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            years
          </span>
        </div>

        <label className="flex items-center cursor-pointer gap-2">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Detail Prediction
          </span>
          <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              checked={detailPrediction}
              onChange={() => setDetailPrediction(!detailPrediction)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
              style={{
                borderColor: detailPrediction ? "var(--brand-primary)" : "#ccc",
                transform: detailPrediction
                  ? "translateX(100%)"
                  : "translateX(0)",
              }}
            />
            <span
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              style={{
                backgroundColor: detailPrediction
                  ? "var(--brand-primary)"
                  : "#ccc",
              }}
            ></span>
          </div>
        </label>
      </div>
      <div className="flex-1 min-h-0">
        <Line options={graphOptions} data={data} />
      </div>
    </div>
  );
}
