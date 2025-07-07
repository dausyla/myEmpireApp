import { useContext, useEffect, useState } from "react";
import { PortofolioContext } from "../../../../contexts/DataContext/PortfolioContextHook";
import { Form, InputGroup } from "react-bootstrap";
import type { Color } from "../../../../types/Assets";

const getColorString = (color: Color) => {
  return `#${((1 << 24) + (color.r << 16) + (color.g << 8) + color.b)
    .toString(16)
    .slice(1)}`;
};

export function EditAsset() {
  const { editingAssetId, portfolio, modifyPortfolio } =
    useContext(PortofolioContext);

  const currentAsset = portfolio.assets.find(
    (asset) => asset.id === editingAssetId
  );

  const [assetName, setAssetName] = useState<string>(
    currentAsset?.name || "Undefined"
  );
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssetName(e.target.value);
    if (!currentAsset || e.target.value.length > 20) return;

    if (e.target.value.length === 0) {
      currentAsset.name = "Undefined";
    } else {
      currentAsset.name = e.target.value;
    }
    modifyPortfolio(portfolio);
  };
  useEffect(() => {
    if (currentAsset && assetName.length > 0) {
      setAssetName(currentAsset.name);
    }
  }, [currentAsset, assetName]);

  const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentAsset) return;
    const colorValue = e.target.value;
    const r = parseInt(colorValue.slice(1, 3), 16);
    const g = parseInt(colorValue.slice(3, 5), 16);
    const b = parseInt(colorValue.slice(5, 7), 16);
    currentAsset.color = { r, g, b };
    modifyPortfolio(portfolio);
  };

  return (
    <div className="m-3">
      {currentAsset ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <InputGroup style={{ width: "20rem" }}>
            <InputGroup.Text>Name</InputGroup.Text>
            <Form.Control onChange={onNameChange} value={assetName} />
          </InputGroup>
          <InputGroup style={{ width: "5rem" }}>
            <Form.Control
              type="color"
              onChange={onColorChange}
              value={getColorString(currentAsset.color)}
            />
          </InputGroup>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
