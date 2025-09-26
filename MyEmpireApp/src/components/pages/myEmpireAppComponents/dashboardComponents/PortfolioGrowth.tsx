import { Chart } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { getColorString, getFadedColor } from "../../../utilies/utilsFunctions";

export function PortfolioGrowth() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;

  const labels = portfolio.dates.map((d) => new Date(d).toLocaleDateString());

  const inputsPerAsset = portfolio.assets.map((asset) =>
    asset.inputs.reduce((acc, input, i) => {
      if (i === 0) {
        acc.push(input);
      } else {
        acc.push(acc[i - 1] + input);
      }
      return acc;
    }, [] as number[])
  );

  // datasets: one line per asset value + one bar for inputs
  const datasets = [
    // Asset values lines
    ...portfolio.assets.map((asset) => ({
      type: "line" as const,
      label: asset.name,
      data: asset.values,
      borderColor: getColorString(asset.color),
      backgroundColor: getColorString(asset.color),
      fill: false,
      tension: 0.2,
    })),
    // Asset inputs stacked bar per date
    ...inputsPerAsset.map((inputs, index) => ({
      type: "bar" as const,
      label: `${portfolio.assets[index].name} Inputs`,
      data: inputs,
      backgroundColor: getFadedColor(portfolio.assets[index].color, 0.5),
      borderColor: getFadedColor(portfolio.assets[index].color, 0.5),
      borderWidth: 1,
      // stack: "Inputs",
    })),
  ];

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: "Portfolio Growth (Values vs Inputs)",
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: { display: true, text: "Value" },
      },
    },
  };

  return <Chart type="bar" data={data} options={options} />;
}
