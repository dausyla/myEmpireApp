import { useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { PortofolioContext } from "../../../../contexts/DataContext/PortfolioContextHook";

const random255 = () => {
  return Math.floor(Math.random() * 255);
};

export function AssetDropdown() {
  const { editingAssetId, setEditingAssetId, portfolio, modifyPortfolio } =
    useContext(PortofolioContext);

  const currentAsset = portfolio.assets.find(
    (asset) => asset.id === editingAssetId
  );

  const assetsItems = portfolio.assets.map((asset) => (
    <Dropdown.Item
      key={asset.id}
      onClick={() => {
        setEditingAssetId?.(asset.id);
      }}
    >
      {asset.name}
    </Dropdown.Item>
  ));

  const newAsset = () => {
    const newAssetId = portfolio.assets.length + 1; // Simple ID generation
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
    setEditingAssetId?.(newAssetId); // Set the new asset as the current
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
