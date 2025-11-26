// EditAsset.tsx
import { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { BsPalette, BsPercent } from "react-icons/bs";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import "./EditAsset.css";

export function EditAsset() {
  const { currentItem } = useApp();
  const { updateAsset } = useBatch();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [apy, setApy] = useState<string>("");

  useEffect(() => {
    if (!currentItem || "wallet_id" in currentItem) return;

    setName(currentItem.name);
    setColor(currentItem.color);
    setApy(currentItem.estimated_apy?.toString() ?? "");
  }, [currentItem]);

  if (!currentItem || "wallet_id" in currentItem) return null;

  const handleSaveAsset = () => {
    updateAsset(currentItem.id, {
      name,
      color,
      estimated_apy: apy === "" ? null : parseFloat(apy),
    });
  };

  return (
    <div className="edit-asset-container">
      {/* Header */}
      <div className="edit-asset-header">
        <div className="d-flex align-items-center gap-2">
          <div
            className="asset-color-preview"
            style={{ backgroundColor: color }}
          />
          <h5 className="mb-0 fw-bold text-white">⚙️ Edit Asset</h5>
        </div>
      </div>

      {/* Asset Configuration */}
      <div className="asset-config-section">
        <div className="row g-3">
          {/* Asset Name */}
          <div className="col-12">
            <div className="form-group-modern">
              <label className="form-label-modern">
                <span className="label-icon">📝</span>
                Asset Name
              </label>
              <Form.Control
                className="form-control-modern"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSaveAsset}
                placeholder="Enter asset name"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="col-md-6">
            <div className="form-group-modern">
              <label className="form-label-modern">
                <BsPalette className="label-icon" />
                Color Theme
              </label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  className="color-picker"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  onBlur={handleSaveAsset}
                />
                <Form.Control
                  className="color-input form-control-modern"
                  value={color.toUpperCase()}
                  onChange={(e) => setColor(e.target.value)}
                  onBlur={handleSaveAsset}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* APY */}
          <div className="col-md-6">
            <div className="form-group-modern">
              <label className="form-label-modern">
                <BsPercent className="label-icon" />
                Est. APY
              </label>
              <InputGroup>
                <Form.Control
                  className="form-control-modern"
                  type="number"
                  step="0.01"
                  value={apy}
                  onChange={(e) => setApy(e.target.value)}
                  onBlur={handleSaveAsset}
                  placeholder="0.00"
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
