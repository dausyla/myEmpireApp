// EditAsset.tsx
import { useState, useEffect } from "react";
import { Card, Form, Button, InputGroup, Badge } from "react-bootstrap";
import { BsPlus, BsTrash, BsPalette, BsPercent, BsRepeat } from "react-icons/bs";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import type { RecurringTransaction } from "@shared/WalletTypes";
import "./EditAsset.css";

export function EditAsset() {
  const { currentItem } = useApp();
  const { updateAsset, addRecurring, updateRecurring, deleteRecurring } =
    useBatch();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [apy, setApy] = useState<string>("");
  const [recurrings, setRecurrings] = useState<
    (RecurringTransaction & { tempId?: string })[]
  >([]);

  useEffect(() => {
    if (!currentItem || "wallet_id" in currentItem) return;

    setName(currentItem.name);
    setColor(currentItem.color);
    setApy(currentItem.estimated_apy?.toString() ?? "");
    setRecurrings(currentItem.recurring_transactions ?? []);
  }, [currentItem]);

  if (!currentItem || "wallet_id" in currentItem) return null;

  const handleSaveAsset = () => {
    updateAsset(currentItem.id, {
      name,
      color,
      estimated_apy: apy === "" ? 0 : parseFloat(apy),
    });
  };

  const addNewRecurring = () => {
    addRecurring({
      asset_id: currentItem.id,
      amount: 0,
      period: "monthly",
    });
  };

  const updateRt = (
    index: number,
    field: keyof RecurringTransaction,
    value: any,
  ) => {
    const rt = recurrings[index];
    updateRecurring(rt.id, { [field]: value });
  };

  const removeRt = (index: number) => {
    deleteRecurring(recurrings[index].id);
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

      {/* Recurring Transactions Section */}
      <div className="recurring-section">
        <div className="recurring-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <BsRepeat className="section-icon" />
              <h6 className="mb-0 fw-bold">Recurring Transactions</h6>
              {recurrings.length > 0 && (
                <Badge bg="primary" className="ms-1">
                  {recurrings.length}
                </Badge>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={addNewRecurring}
              className="add-recurring-btn"
            >
              <BsPlus className="me-1" />
              Add
            </Button>
          </div>
        </div>

        <div className="recurring-list">
          {recurrings.length === 0 ? (
            <div className="empty-state">
              <BsRepeat className="empty-icon" />
              <p className="mb-0 text-muted">No recurring transactions</p>
              <small className="text-muted">Add automated income or expenses</small>
            </div>
          ) : (
            <div className="recurring-items">
              {recurrings.map((rt, i) => (
                <div key={rt.tempId ?? rt.id} className="recurring-item">
                  <div className="row g-2 align-items-center">
                    <div className="col-auto">
                      <div className="recurring-icon">
                        <BsRepeat />
                      </div>
                    </div>
                    <div className="col">
                      <InputGroup size="sm">
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={rt.amount}
                          onChange={(e) =>
                            updateRt(i, "amount", parseFloat(e.target.value) || 0)
                          }
                          className="amount-input"
                        />
                      </InputGroup>
                    </div>
                    <div className="col-auto">
                      <Form.Select
                        size="sm"
                        value={rt.period}
                        onChange={(e) =>
                          updateRt(i, "period", e.target.value as any)
                        }
                        className="period-select"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </Form.Select>
                    </div>
                    <div className="col-auto">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeRt(i)}
                        className="delete-btn"
                      >
                        <BsTrash />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
