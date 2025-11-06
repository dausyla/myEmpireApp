import { Line } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { Card, Form, InputGroup } from "react-bootstrap";
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
    overYears
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
      (date) => new Date(date).toISOString().split("T")[0]
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
      [] as Dataset[]
    ),
  };

  return (
    <Card className="rounded shadow-sm p-2 h-100">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <InputGroup style={{ width: "17rem", marginBottom: "1rem" }}>
          <InputGroup.Text>Prediction over</InputGroup.Text>
          <Form.Control
            type="number"
            onChange={onYearsChange}
            value={overYears}
          />
          <InputGroup.Text>years</InputGroup.Text>
        </InputGroup>
        <Form.Check
          type="switch"
          label="Detail Prediction"
          value={detailPrediction ? "on" : "off"}
          onChange={() => setDetailPrediction(!detailPrediction)}
        />
      </div>
      <div style={{ height: "90%" }}>
        <Line options={graphOptions} data={data} />
      </div>
    </Card>
  );
}
