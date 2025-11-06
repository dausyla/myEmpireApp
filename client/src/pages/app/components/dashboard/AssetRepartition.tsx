import { Pie } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { getColorString } from "../../../../utilies/utilsFunctions";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";

export function AssetRepartition() {
  const { portfolio } = usePortfolio();
  const { mapAssets } = useAssetContext();
  if (!portfolio) return null;

  const labels: string[] = [];
  mapAssets((a) => labels.push(a.name));
  const data: number[] = [];
  mapAssets((a) => data.push(a.values[a.values.length - 1]));
  const colors: string[] = [];
  mapAssets((a) => colors.push(getColorString(a.color)));

  return (
    <Pie
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false, // let it fill the container
        plugins: {
          title: {
            display: true,
            text: "Asset Repartition",
          },
          legend: {
            position: "left",
          },
        },
      }}
    />
  );
}
