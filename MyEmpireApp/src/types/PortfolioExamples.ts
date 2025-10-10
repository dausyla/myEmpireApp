import type { Asset, Directory, Portfolio } from "./PortfolioTypes";

export const emptyPortfolio: Portfolio = {
  id: "",
  name: "New Portfolio",
  description: "Portfolio Description",
  dates: [],
  root: {
    id: 1,
    subAssets: [],
    subDirs: [],
    isOpened: true,
    name: "/",
    parentDirId: 0,
  },
  dirNumber: 1,
  assetNumber: 0,
};

/*/==============\
 ||              ||
 || Example Data ||
 ||              ||
  \==============/
*/

// Assets Example
const assetExampleBitcoin: Asset = {
  id: 1,
  name: "Bitcoin",
  values: [5000, 5200, 5350, 5300, 5650, 5700, 5750, 5800],
  inputs: [5000, 0, 200, 0, 300, 0, 100, 0],
  prediction: {
    estimatedAPY: 0.065,
    monthlyInput: 1500,
  },
  color: { r: 255, g: 0, b: 0 }, // Red
  parentDirID: 1,
};
const assetExampleEthereum: Asset = {
  id: 2,
  name: "Ethereum",
  values: [3000, 3100, 3150, 3350, 3300, 3400, 3400, 3500],
  inputs: [3000, 0, 100, 0, 150, 0, 50, 0],
  prediction: {
    estimatedAPY: 0.045,
    monthlyInput: 800,
  },
  color: { r: 128, g: 128, b: 255 }, // Purple
  parentDirID: 1,
};
const assetExampleSNP500: Asset = {
  id: 3,
  name: "S&P 500 ETF",
  values: [4000, 4050, 4600, 4650, 4800, 4700, 4775, 5300],
  inputs: [4000, 0, 500, 0, 100, 0, 0, 500],
  prediction: {
    estimatedAPY: 0.08,
    monthlyInput: 600,
  },
  color: { r: 0, g: 153, b: 76 }, // Green
  parentDirID: 2,
};
const assetExampleGold: Asset = {
  id: 4,
  name: "Gold",
  values: [1000, 1020, 1010, 1530, 1550, 1540, 2060, 2000],
  inputs: [1000, 0, 0, 500, 0, 0, 500, 0],
  prediction: {
    estimatedAPY: 0.03,
    monthlyInput: 300,
  },
  color: { r: 255, g: 215, b: 0 }, // Gold
  parentDirID: 0,
};

// Dirs Example
const cryptoDir: Directory = {
  name: "Crypto",
  id: 1,
  isOpened: true,
  subAssets: [assetExampleBitcoin, assetExampleEthereum],
  subDirs: [],
  parentDirId: 1,
};
const stockDir: Directory = {
  name: "Stocks",
  id: 2,
  isOpened: false,
  subAssets: [assetExampleSNP500],
  subDirs: [],
  parentDirId: 1,
};
const rootDir: Directory = {
  id: 0,
  name: "/",
  isOpened: true,
  subDirs: [stockDir, cryptoDir],
  subAssets: [assetExampleGold],
  parentDirId: -1,
};

// Portfolio Example
export const portfolioExample: Portfolio = {
  id: "portfolio-2025-complex",
  name: "Diversified Growth Portfolio",
  description:
    "A diversified portfolio including cryptocurrencies, equities, and commodities for balanced growth.",
  root: rootDir,
  assetNumber: 4,
  dirNumber: 2,
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
