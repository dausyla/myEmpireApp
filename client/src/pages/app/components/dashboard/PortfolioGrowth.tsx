import { Chart } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/WalletContext/WalletContextHook";
import {
  getColorString,
  getFadedColor,
} from "../../../../utilies/utilsFunctions";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";

export function PortfolioGrowth() {
  const { portfolio } = usePortfolio();
  const { mapAssets } = useAssetContext();
  if (!portfolio) return null;

  const labels = portfolio.dates.map((d) => new Date(d).toLocaleDateString());

  const inputsPerAsset: { inputs: number[]; name: string; color: string }[] =
    [];
  mapAssets((asset) =>
    inputsPerAsset.push({
      inputs: asset.inputs.reduce((acc, input, i) => {
        if (i === 0) {
          acc.push(input);
        } else {
          acc.push(acc[i - 1] + input);
        }
        return acc;
      }, [] as number[]),
      name: asset.name,
      color: getFadedColor(asset.color),
    }),
  );

  const assetValuesLine: {
    type: "line";
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[] = [];
  mapAssets((a) => {
    assetValuesLine.push({
      type: "line" as const,
      label: a.name,
      data: a.values,
      borderColor: getColorString(a.color),
      backgroundColor: getColorString(a.color),
      fill: false,
      tension: 0.2,
    });
  });

  // datasets: one line per asset value + one bar for inputs
  const datasets = [
    ...assetValuesLine,
    // Asset inputs stacked bar per date
    ...inputsPerAsset.map((a) => ({
      type: "bar" as const,
      label: `${a.name} Inputs`,
      data: a.inputs,
      backgroundColor: a.color,
      borderColor: a.color,
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
