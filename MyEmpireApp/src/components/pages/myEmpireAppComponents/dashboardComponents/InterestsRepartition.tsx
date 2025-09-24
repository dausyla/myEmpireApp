import { Pie } from "react-chartjs-2";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { getColorString } from "../../../utilies/utilsFunctions";

export function InterestsRepartition() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;

  const labels = portfolio.assets.map((a) => a.name);
  const data = portfolio.assets.map((a) => {
    const inputs = a.inputs.reduce((acc, v) => acc + v, 0);
    const value = a.values[a.values.length - 1];
    return value - inputs;
  });

  const colors = portfolio.assets.map((a) => getColorString(a.color));

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
            text: "Interests Repartition",
          },
          legend: {
            position: "right",
          },
        },
      }}
    />
  );
}
