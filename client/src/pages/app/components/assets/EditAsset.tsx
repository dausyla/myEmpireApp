// EditAsset.tsx
import { useState, useEffect } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import type { RecurringTransaction } from "@shared/WalletTypes";

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
    <Card className="h-100">
      <Card.Header>
        <strong>Edit Asset</strong>
      </Card.Header>
      <Card.Body className="d-flex flex-column gap-3">
        {/* Asset Fields */}
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSaveAsset}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Color</Form.Label>
          <div className="d-flex gap-2 align-items-center">
            <Form.Control
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              onBlur={handleSaveAsset}
              style={{ width: 60, height: 38, padding: 1 }}
            />
            <Form.Control
              value={color}
              onChange={(e) => setColor(e.target.value)}
              onBlur={handleSaveAsset}
              style={{ flex: 1 }}
            />
          </div>
        </Form.Group>

        <Form.Group>
          <Form.Label>Estimated APY (%)</Form.Label>
          <Form.Control
            type="number"
            value={apy}
            onChange={(e) => setApy(e.target.value)}
            onBlur={handleSaveAsset}
            placeholder="Leave empty for none"
          />
        </Form.Group>

        {/* Recurring Transactions */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Recurring Transactions</strong>
            <Button size="sm" onClick={addNewRecurring}>
              + Add
            </Button>
          </div>

          {recurrings.length === 0 ? (
            <p className="text-muted small">No recurring transactions</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {recurrings.map((rt, i) => (
                <InputGroup key={rt.tempId ?? rt.id} size="sm">
                  <Form.Control
                    type="number"
                    value={rt.amount}
                    onChange={(e) =>
                      updateRt(i, "amount", parseFloat(e.target.value) || 0)
                    }
                    style={{ maxWidth: 100 }}
                  />
                  <Form.Select
                    value={rt.period}
                    onChange={(e) =>
                      updateRt(i, "period", e.target.value as any)
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </Form.Select>
                  <Button variant="outline-danger" onClick={() => removeRt(i)}>
                    ×
                  </Button>
                </InputGroup>
              ))}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
