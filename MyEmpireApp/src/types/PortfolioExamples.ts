import type { Asset, Portfolio } from "./PortfolioTypes";

export const emptyPortfolio: Portfolio = {
  id: "",
  name: "New Portfolio",
  description: "Portfolio Description",
  assets: [],
  dates: [],
};

export const assetsExample: Asset[] = [
  {
    id: 1,
    name: "Bitcoin",
    values: [5000, 5200, 5350, 5300, 5650, 5700, 5750, 5800],
    inputs: [5000, 0, 200, 0, 300, 0, 100, 0],
    prediction: {
      estimatedAPY: 0.065,
      monthlyInput: 1500,
    },
    color: { r: 255, g: 0, b: 0 }, // Red
  },
  {
    id: 2,
    name: "Ethereum",
    values: [3000, 3100, 3150, 3350, 3300, 3400, 3400, 3500],
    inputs: [3000, 0, 100, 0, 150, 0, 50, 0],
    prediction: {
      estimatedAPY: 0.045,
      monthlyInput: 800,
    },
    color: { r: 128, g: 128, b: 255 }, // Purple
  },
  {
    id: 3,
    name: "S&P 500 ETF",
    values: [4000, 4050, 4600, 4650, 4800, 4700, 4775, 5300],
    inputs: [4000, 0, 500, 0, 100, 0, 0, 500],
    prediction: {
      estimatedAPY: 0.08,
      monthlyInput: 600,
    },
    color: { r: 0, g: 153, b: 76 }, // Green
  },
  {
    id: 4,
    name: "Gold",
    values: [1000, 1020, 1010, 1530, 1550, 1540, 2060, 2000],
    inputs: [1000, 0, 0, 500, 0, 0, 500, 0],
    prediction: {
      estimatedAPY: 0.03,
      monthlyInput: 300,
    },
    color: { r: 255, g: 215, b: 0 }, // Gold
  },
];

export const portfolioExample: Portfolio = {
  id: "portfolio-2025-complex",
  name: "Diversified Growth Portfolio",
  description:
    "A diversified portfolio including cryptocurrencies, equities, and commodities for balanced growth.",
  assets: assetsExample,
  dates: [
    1735689600000, // Jan 1, 2025
    1738368000000, // Feb 1, 2025
    1740787200000, // Mar 1, 2025
    1743465600000, // Apr 1, 2025
    1746057600000, // May 1, 2025
    1748736000000, // Jun 1, 2025
    1751328000000, // Jul 1, 2025
    1754006400000, // Aug 1, 2025
  ],
};
