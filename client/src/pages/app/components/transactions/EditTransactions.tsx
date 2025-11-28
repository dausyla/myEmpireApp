import { useState } from "react";
import { Button, Table, Form, Row, Col, Alert, Modal } from "react-bootstrap";
import { BsTrash, BsPlus } from "react-icons/bs";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useData } from "../../../../contexts/DataContext/DataContextHook";
import { EditableText } from "../../../../utilies/components/EditableText";
import { EditableValue } from "../../../../utilies/components/EditableValue";
import type { Transaction, TransactionTypes } from "@shared/WalletTypes";

import "./EditTransactions.css";

export function EditTransactions() {
  const { wallet } = useWallet();
  const { getSortedDates } = useData();
  const { addTransaction, updateTransaction, deleteTransaction } = useBatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  // Form state for new transaction
  const [newTransaction, setNewTransaction] = useState({
    to_asset_id: "",
    from_asset_id: "",
    description: "",
    date_id: "",
    amount: "",
    type: "deposit" as TransactionTypes,
  });

  if (!wallet) {
    return <Alert variant="warning">No wallet selected</Alert>;
  }

  // Get all transactions from the wallet
  const allTransactions = wallet.transactions.map((tx) => {
    const fromAsset = tx.from_asset_id
      ? wallet.assets.find((a) => a.id === tx.from_asset_id)
      : null;
    const toAsset = tx.to_asset_id
      ? wallet.assets.find((a) => a.id === tx.to_asset_id)
      : null;
    return {
      ...tx,
      fromAssetName: fromAsset?.name || null,
      toAssetName: toAsset?.name || null,
    };
  });

  // Sort transactions by date (most recent first)
  const sortedTransactions = allTransactions.sort((a, b) => {
    const dateA = wallet.dates.find((d) => d.id === a.date_id)?.date || "";
    const dateB = wallet.dates.find((d) => d.id === b.date_id)?.date || "";
    return dateB.localeCompare(dateA);
  });

  const availableDates = getSortedDates();
  const availableAssets = wallet.assets;

  const handleAddTransaction = () => {
    if (
      !newTransaction.description.trim() ||
      !newTransaction.amount ||
      !newTransaction.date_id
    ) {
      return;
    }

    const transactionData = {
      wallet_id: wallet.wallet.id,
      to_asset_id: newTransaction.to_asset_id
        ? parseInt(newTransaction.to_asset_id)
        : undefined,
      from_asset_id: newTransaction.from_asset_id
        ? parseInt(newTransaction.from_asset_id)
        : undefined,
      description: newTransaction.description.trim(),
      date_id: parseInt(newTransaction.date_id),
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
    };

    addTransaction(transactionData);

    // Reset form
    setNewTransaction({
      to_asset_id: "",
      from_asset_id: "",
      description: "",
      date_id: "",
      amount: "",
      type: "deposit",
    });
    setIsAddingTransaction(false);
  };

  const handleUpdateTransaction = (
    id: number,
    field: keyof Transaction,
    value: any,
  ) => {
    updateTransaction(id, { [field]: value });
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    }
  };

  const formatDate = (dateId: number) => {
    const date = wallet.dates.find((d) => d.id === dateId);
    return date ? date.date.replace(/-/g, "/") : "Unknown";
  };

  const getTransactionAssetNames = (tx: (typeof allTransactions)[0]) => ({
    from: tx.fromAssetName || "-",
    to: tx.toAssetName || "-",
  });

  return (
    <div className="edit-transactions-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold">Edit Transactions</h5>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddingTransaction(!isAddingTransaction)}
        >
          <BsPlus className="me-1" />
          Add
        </Button>
      </div>

      {/* Add Transaction Form */}
      {isAddingTransaction && (
        <div className="add-transaction-section">
          <h6 className="mb-3">Add New Transaction</h6>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
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
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      type: e.target.value as TransactionTypes,
                    }))
                  }
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="fee">Fee</option>
                  <option value="reward">Reward</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Select
                  value={newTransaction.date_id}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      date_id: e.target.value,
                    }))
                  }
                >
                  <option value="">Select date</option>
                  {availableDates.map((date) => (
                    <option key={date.id} value={date.id}>
                      {date.date.replace(/-/g, "/")}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>From Asset (optional)</Form.Label>
                <Form.Select
                  value={newTransaction.from_asset_id}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      from_asset_id: e.target.value,
                    }))
                  }
                >
                  <option value="">None</option>
                  {availableAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>To Asset (optional)</Form.Label>
                <Form.Select
                  value={newTransaction.to_asset_id}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      to_asset_id: e.target.value,
                    }))
                  }
                >
                  <option value="">None</option>
                  {availableAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <div className="d-flex gap-2">
                <Button variant="success" onClick={handleAddTransaction}>
                  Add Transaction
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsAddingTransaction(false)}
                >
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Transactions Table */}
      <div className="table-responsive flex-grow-1">
        <Table
          hover
          size="sm"
          className="transactions-table align-middle text-nowrap"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>From Asset</th>
              <th>To Asset</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No transactions found
                </td>
              </tr>
            ) : (
              sortedTransactions.map((transaction) => {
                const assetNames = getTransactionAssetNames(transaction);
                return (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.date_id)}</td>
                    <td>
                      <EditableText
                        value={transaction.description}
                        modifyValue={(value) =>
                          handleUpdateTransaction(
                            transaction.id,
                            "description",
                            value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <EditableValue
                        value={transaction.amount}
                        modifyValue={(value) =>
                          handleUpdateTransaction(
                            transaction.id,
                            "amount",
                            value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={transaction.type}
                        onChange={(e) =>
                          handleUpdateTransaction(
                            transaction.id,
                            "type",
                            e.target.value as TransactionTypes,
                          )
                        }
                        style={{ width: "120px" }}
                      >
                        <option value="deposit">Deposit</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="fee">Fee</option>
                        <option value="reward">Reward</option>
                      </Form.Select>
                    </td>
                    <td>{assetNames.from}</td>
                    <td>{assetNames.to}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction)}
                      >
                        <BsTrash />
                      </Button>
                    </td>
                  </tr>
                );
              })
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
          Are you sure you want to delete this transaction?
          {transactionToDelete && (
            <div className="mt-3 p-3 bg-light rounded">
              <strong>{transactionToDelete.description}</strong>
              <br />
              Amount: {transactionToDelete.amount}
              <br />
              Date: {formatDate(transactionToDelete.date_id)}
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
            Delete Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
