import { useState } from "react";
import { Button, Table, Form, Row, Col, Alert, Modal } from "react-bootstrap";
import { BsTrash, BsPlus } from "react-icons/bs";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { EditableText } from "../../../../utilies/components/EditableText";
import { EditableValue } from "../../../../utilies/components/EditableValue";
import type { RecurringTransaction, TransactionTypes } from "@shared/WalletTypes";

export function EditRecurringTransactions() {
  const { wallet } = useWallet();
  const { getSortedDates } = useData();
  const {
    addRecurring,
    updateRecurring,
    deleteRecurring,
  } = useBatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recurringToDelete, setRecurringToDelete] = useState<RecurringTransaction | null>(null);
  const [isAddingRecurring, setIsAddingRecurring] = useState(false);

  // Form state for new recurring transaction
  const [newRecurring, setNewRecurring] = useState({
    to_asset_id: "",
    from_asset_id: "",
    description: "",
    amount: "",
    type: "deposit" as TransactionTypes,
    period: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
  });

  if (!wallet) {
    return <Alert variant="warning">No wallet selected</Alert>;
  }

  const availableAssets = wallet.assets;

  const handleAddRecurring = () => {
    if (!newRecurring.description.trim() || !newRecurring.amount) {
      return;
    }

    const recurringData = {
      wallet_id: wallet.wallet.id,
      to_asset_id: newRecurring.to_asset_id ? parseInt(newRecurring.to_asset_id) : undefined,
      from_asset_id: newRecurring.from_asset_id ? parseInt(newRecurring.from_asset_id) : undefined,
      description: newRecurring.description.trim(),
      amount: parseFloat(newRecurring.amount),
      type: newRecurring.type,
      period: newRecurring.period,
    };

    addRecurring(recurringData);

    // Reset form
    setNewRecurring({
      to_asset_id: "",
      from_asset_id: "",
      description: "",
      amount: "",
      type: "deposit",
      period: "monthly",
    });
    setIsAddingRecurring(false);
  };

  const handleUpdateRecurring = (id: number, field: keyof RecurringTransaction, value: any) => {
    updateRecurring(id, { [field]: value });
  };

  const handleDeleteRecurring = (recurring: RecurringTransaction) => {
    setRecurringToDelete(recurring);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (recurringToDelete) {
      deleteRecurring(recurringToDelete.id);
      setShowDeleteModal(false);
      setRecurringToDelete(null);
    }
  };

  const getAssetName = (assetId?: number) => {
    if (!assetId) return '-';
    const asset = wallet.assets.find(a => a.id === assetId);
    return asset ? asset.name : 'Unknown';
  };

  const getPeriodLabel = (period: string) => {
    const labels: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
    };
    return labels[period] || period;
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Edit Recurring Transactions</h3>
        <Button
          variant="primary"
          onClick={() => setIsAddingRecurring(!isAddingRecurring)}
        >
          <BsPlus className="me-2" />
          Add Recurring
        </Button>
      </div>

      {/* Add Recurring Transaction Form */}
      {isAddingRecurring && (
        <div className="mb-4 p-3 border rounded">
          <h5>Add New Recurring Transaction</h5>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecurring.description}
                  onChange={(e) => setNewRecurring(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Transaction description"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={newRecurring.amount}
                  onChange={(e) => setNewRecurring(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={newRecurring.type}
                  onChange={(e) => setNewRecurring(prev => ({ ...prev, type: e.target.value as TransactionTypes }))}
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="fee">Fee</option>
                  <option value="reward">Reward</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Period</Form.Label>
                <Form.Select
                  value={newRecurring.period}
                  onChange={(e) => setNewRecurring(prev => ({ ...prev, period: e.target.value as "daily" | "weekly" | "monthly" | "yearly" }))}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>From Asset (optional)</Form.Label>
                <Form.Select
                  value={newRecurring.from_asset_id}
                  onChange={(e) => setNewRecurring(prev => ({ ...prev, from_asset_id: e.target.value }))}
                >
                  <option value="">None</option>
                  {availableAssets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>To Asset (optional)</Form.Label>
                <Form.Select
                  value={newRecurring.to_asset_id}
                  onChange={(e) => setNewRecurring(prev => ({ ...prev, to_asset_id: e.target.value }))}
                >
                  <option value="">None</option>
                  {availableAssets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <div className="d-flex gap-2">
                <Button variant="success" onClick={handleAddRecurring}>
                  Add Recurring Transaction
                </Button>
                <Button variant="secondary" onClick={() => setIsAddingRecurring(false)}>
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Recurring Transactions Table */}
      <div style={{ maxHeight: "600px", overflowY: "auto" }}>
        <Table striped bordered hover>
          <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Period</th>
              <th>From Asset</th>
              <th>To Asset</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallet.recurring_transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No recurring transactions found
                </td>
              </tr>
            ) : (
              wallet.recurring_transactions.map((recurring) => (
                <tr key={recurring.id}>
                  <td>
                    <EditableText
                      value={recurring.description}
                      modifyValue={(value) => handleUpdateRecurring(recurring.id, 'description', value)}
                    />
                  </td>
                  <td>
                    <EditableValue
                      value={recurring.amount}
                      modifyValue={(value) => handleUpdateRecurring(recurring.id, 'amount', value)}
                    />
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={recurring.type}
                      onChange={(e) => handleUpdateRecurring(recurring.id, 'type', e.target.value as TransactionTypes)}
                      style={{ width: "120px" }}
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="fee">Fee</option>
                      <option value="reward">Reward</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={recurring.period}
                      onChange={(e) => handleUpdateRecurring(recurring.id, 'period', e.target.value as "daily" | "weekly" | "monthly" | "yearly")}
                      style={{ width: "100px" }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </Form.Select>
                  </td>
                  <td>{getAssetName(recurring.from_asset_id)}</td>
                  <td>{getAssetName(recurring.to_asset_id)}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteRecurring(recurring)}
                    >
                      <BsTrash />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this recurring transaction?
          {recurringToDelete && (
            <div className="mt-3 p-3 bg-light rounded">
              <strong>{recurringToDelete.description}</strong><br />
              Amount: {recurringToDelete.amount}<br />
              Period: {getPeriodLabel(recurringToDelete.period)}
            </div>
          )}
          <div className="alert alert-warning mt-3">
            <small>This action cannot be undone.</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Recurring Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
