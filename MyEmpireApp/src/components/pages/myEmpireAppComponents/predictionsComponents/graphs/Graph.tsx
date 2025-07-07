import { Line } from "react-chartjs-2";
import { usePortfolio } from "../../../../../contexts/DataContext/PortfolioContextHook";
import { Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { getDates, getPredictedValues } from "./predictionUtils";
import type { Color } from "../../../../../types/Assets";

const getFadedColor = (color: Color, alpha: number = 0.5) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`; // Return a string in rgba format with alpha
};

const getColorString = (c: Color) => {
  return `rgba(${c.r}, ${c.g}, ${c.b})`; // Return a string in rgba format
};

export function Graphs() {
  const { portfolio } = usePortfolio();

  const [overMonths, setOverMonths] = useState(12);

  const onMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = Number(value);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setOverMonths(parsedValue);
    } else {
      setOverMonths(0);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        stacked: true,
        min: 0,
      },
    },
    plugins: {
      filler: {
        propagate: false,
      },
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Portfolio Value Over Time",
      },
    },
  };

  const datasets = portfolio.assets.map((asset) => ({
    label: asset.name,
    data: getPredictedValues(asset, overMonths),
    borderColor: getColorString(asset.color),
    backgroundColor: getFadedColor(asset.color),
    fill: true,
  }));

  const data = {
    labels: getDates(portfolio.dates, overMonths).map(
      (date) => new Date(date).toISOString().split("T")[0]
    ),
    datasets,
  };

  return (
    <>
      <InputGroup>
        <InputGroup.Text>Prediction over:</InputGroup.Text>
        <Form.Control onChange={onMonthsChange} value={overMonths} />
        <InputGroup.Text>months</InputGroup.Text>
      </InputGroup>
      <Line options={options} data={data} />
    </>
  );
}
