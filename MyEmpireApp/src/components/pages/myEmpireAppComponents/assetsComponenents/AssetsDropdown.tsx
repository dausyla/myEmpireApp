import Dropdown from "react-bootstrap/Dropdown";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";
import { Button } from "react-bootstrap";

export function AssetDropdown() {
  const { portfolio } = usePortfolio();
  const { currentAssetId, setCurrentAsset, addNewAsset } = useAssetContext();

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

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button onClick={() => addNewAsset()} variant="outline-primary">
        +
      </Button>
      <Dropdown style={{ textAlign: "left" }} className="m-3">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {currentAsset?.name || "Select Asset"}
        </Dropdown.Toggle>

        <Dropdown.Menu>{assetsItems}</Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
