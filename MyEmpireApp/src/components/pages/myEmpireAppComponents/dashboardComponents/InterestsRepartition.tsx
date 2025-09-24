import { Pie } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";

export function InterestsRepartition() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;

  const labels = portfolio.assets.map((a) => a.name);
  const data = portfolio.assets.map((a) => {
    const inputs = a.inputs.reduce((acc, v) => acc + v, 0);
    const value = a.values[a.values.length - 1];
    return value - inputs;
  });

  return (
    <Pie
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#FFCE56",
              "#FF6384",
              "#36A2EB",
              "#4BC0C0",
              "#9966FF",
            ],
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
