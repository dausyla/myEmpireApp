import { Bubble } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import {
  getAssetPerformence,
  getFadedColor,
} from "../../../../utilies/utilsFunctions";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";
import type { AssetPerformance } from "../../../../types/PortfolioTypes";

export function InterestsRepartition() {
  const { portfolio } = usePortfolio();
  const { mapAssets } = useAssetContext();
  if (!portfolio) return null;

  const labels: string[] = [];
  mapAssets((a) => labels.push(a.name));

  const performances: AssetPerformance[] = [];
  mapAssets((a) => performances.push(getAssetPerformence(a, portfolio.dates)));

  const maxValue = Math.max(...performances.map((p) => p.totalValue), 1); // avoid division by zero

  const points = performances.map((p, i) => {
    const interest = p.totalValue * (p.apy / 12);
    return {
      x: interest, // monthly interest
      y: p.apy * 100, // APY in %
      r: Math.max((15 * p.totalValue) / maxValue, 5), // bubble size scaled
      meta: {
        label: labels[i],
        apy: p.apy * 100,
        interest,
      },
    };
  });

  const colors: string[] = [];
  mapAssets((a) => colors.push(getFadedColor(a.color)));
  const data = {
    datasets: [
      {
        label: "Assets",
        data: points.map((p) => ({
          x: p.x,
          y: p.y,
          r: p.r,
        })),
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => {
            const p = points[ctx.dataIndex].meta;
            return `${p.label} → APY ${p.apy.toFixed(
              2
            )}%, Monthly: ${p.interest.toFixed(2)}$`;
          },
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: "Monthly Interest ($)" },
      },
      y: {
        title: { display: true, text: "APY (%)" },
      },
    },
  };

  return <Bubble data={data} options={options} />;
}
