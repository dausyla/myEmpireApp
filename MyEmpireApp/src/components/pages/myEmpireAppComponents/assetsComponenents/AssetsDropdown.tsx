import Dropdown from "react-bootstrap/Dropdown";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";

const random255 = () => {
  return Math.floor(Math.random() * 255);
};

export function AssetDropdown() {
  const { portfolio, modifyPortfolio } = usePortfolio();
  const { currentAssetId, setCurrentAsset } = useAssetContext();

  const currentAsset = portfolio?.assets.find(
    (asset) => asset.id === currentAssetId
  );

  if (!portfolio || !currentAsset) return null;

  const assetsItems = portfolio.assets.map((asset) => (
    <Dropdown.Item
      key={asset.id}
      onClick={() => {
        setCurrentAsset(asset.id);
      }}
    >
      {asset.name}
    </Dropdown.Item>
  ));

  const newAsset = () => {
    const maxAssetId = portfolio.assets.reduce(
      (maxId, asset) => (asset.id > maxId ? asset.id : maxId),
      0
    );
    const newAssetId = maxAssetId + 1; // Simple ID generation
    portfolio.assets.push({
      id: newAssetId,
      name: "New Asset",
      values: portfolio.dates.map(() => 0), // Initialize with zeros
      inputs: portfolio.dates.map(() => 0), // Initialize with zeros
      prediction: {
        estimatedAPY: 0,
        monthlyInput: 0,
      },
      color: {
        r: random255(),
        g: random255(),
        b: random255(),
      },
    });
    modifyPortfolio(portfolio);
    setCurrentAsset(newAssetId); // Set the new asset as the current
  };

  return (
    <Dropdown style={{ textAlign: "left" }} className="m-3">
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        {currentAsset?.name || "Select Asset"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={newAsset}>Create new Asset</Dropdown.Item>
        {assetsItems}
      </Dropdown.Menu>
    </Dropdown>
  );
}
