import { Line } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";

export function PortfolioGrowth() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;

  const labels = portfolio.dates.map((d) => new Date(d).toLocaleDateString());

  const totalValues = portfolio.dates.map((_, i) =>
    portfolio.assets.reduce((acc, a) => acc + (a.values[i] || 0), 0)
  );

  const totalInputs = portfolio.dates.map((_, i) =>
    portfolio.assets.reduce((acc, a) => acc + (a.inputs[i] || 0), 0)
  );

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Portfolio Value",
            data: totalValues,
            borderColor: "#36A2EB",
            fill: false,
          },
          {
            label: "Cumulative Inputs",
            data: totalInputs,
            borderColor: "#FF6384",
            fill: false,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false, // let it fill the container
        plugins: {
          legend: {
            position: "top",
          },
        },
      }}
    />
  );
}
