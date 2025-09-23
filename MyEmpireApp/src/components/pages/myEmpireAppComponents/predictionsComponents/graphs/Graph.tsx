import { Line } from "react-chartjs-2";
import { usePortfolio } from "../../../../../contexts/PortfolioContext/PortfolioContextHook";
import { Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { getDataset, graphOptions } from "./predictionUtils";

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

  const dataset = getDataset(portfolio, overYears, detailPrediction);

  return (
    <>
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
      <Line options={graphOptions} data={dataset} />
    </>
  );
}
