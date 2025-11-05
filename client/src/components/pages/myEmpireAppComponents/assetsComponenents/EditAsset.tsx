import { useContext } from "react";
import { PortofolioContext } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { Button, Form } from "react-bootstrap";
import type { Color } from "../../../../types/PortfolioTypes";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";
import { EditableText } from "../../../utilies/EditableText";
import { BsTrash } from "react-icons/bs";

const getColorString = (color: Color) => {
  return `#${((1 << 24) + (color.r << 16) + (color.g << 8) + color.b)
    .toString(16)
    .slice(1)}`;
};

export function EditAsset() {
  const { portfolio, modifyPortfolio } = useContext(PortofolioContext);

  const { currentAsset, deleteAsset } = useAssetContext();

  if (!portfolio) return null;

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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <EditableText
            value={currentAsset.name}
            modifyValue={(newName) => {
              currentAsset.name = newName;
              modifyPortfolio(portfolio);
            }}
          />
          <Form.Control
            type="color"
            onChange={onColorChange}
            value={getColorString(currentAsset.color)}
          />
          <Button
            variant="outline-danger"
            onClick={() => deleteAsset(currentAsset)}
          >
            <BsTrash />
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
