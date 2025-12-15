import { useState, useEffect } from "react";
import { BsTrash, BsPlus } from "react-icons/bs";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { EditableText } from "../../../../utilies/components/EditableText";
import { EditableValue } from "../../../../utilies/components/EditableValue";
import type {
  RecurringTransaction,
  TransactionTypes,
} from "@shared/WalletTypes";
import { useWindowContext } from "../../../../utilies/components/WindowContext";

export function EditRecurringTransactions() {
  const { wallet } = useWallet();
  const { addRecurring, updateRecurring, deleteRecurring } = useBatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recurringToDelete, setRecurringToDelete] =
    useState<RecurringTransaction | null>(null);
  const [isAddingRecurring, setIsAddingRecurring] = useState(false);
  const { setHeaderActions } = useWindowContext();

  useEffect(() => {
    setHeaderActions(
      <button
        className="btn btn-primary-full"
        onClick={() => setIsAddingRecurring((prev) => !prev)}
      >
        <BsPlus className="mr-1 text-lg" />
        Add
      </button>,
    );
  }, [setHeaderActions]);

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
    return (
      <div className="p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg">
        No wallet selected
      </div>
    );
  }

  const availableAssets = wallet.assets;

  const handleAddRecurring = () => {
    if (!newRecurring.description.trim() || !newRecurring.amount) {
      return;
    }

    const recurringData = {
      wallet_id: wallet.wallet.id,
      to_asset_id: newRecurring.to_asset_id
        ? parseInt(newRecurring.to_asset_id)
        : undefined,
      from_asset_id: newRecurring.from_asset_id
        ? parseInt(newRecurring.from_asset_id)
        : undefined,
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

  const handleUpdateRecurring = (
    id: number,
    field: keyof RecurringTransaction,
    value: any,
  ) => {
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
    if (!assetId) return "-";
    const asset = wallet.assets.find((a) => a.id === assetId);
    return asset ? asset.name : "Unknown";
  };

  const getPeriodLabel = (period: string) => {
    const labels: Record<string, string> = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    };
    return labels[period] || period;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Add Recurring Transaction Form */}
      {isAddingRecurring && (
        <div className="m-4 p-2 card">
          <h6 className="mb-3 font-medium text-[var(--text-primary)]">
            Add New Recurring Transaction
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Description
              </label>
              <input
                type="text"
                value={newRecurring.description}
                onChange={(e) =>
                  setNewRecurring((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Transaction description"
                className="w-full input"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={newRecurring.amount}
                onChange={(e) =>
                  setNewRecurring((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                placeholder="0.00"
                className="w-full input"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Type
              </label>
              <select
                value={newRecurring.type}
                onChange={(e) =>
                  setNewRecurring((prev) => ({
                    ...prev,
                    type: e.target.value as TransactionTypes,
                  }))
                }
                className="w-full input"
              >
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="fee">Fee</option>
                <option value="reward">Reward</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Period
              </label>
              <select
                value={newRecurring.period}
                onChange={(e) =>
                  setNewRecurring((prev) => ({
                    ...prev,
                    period: e.target.value as
                      | "daily"
                      | "weekly"
                      | "monthly"
                      | "yearly",
                  }))
                }
                className="w-full input"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                From Asset (optional)
              </label>
              <select
                value={newRecurring.from_asset_id}
                onChange={(e) =>
                  setNewRecurring((prev) => ({
                    ...prev,
                    from_asset_id: e.target.value,
                  }))
                }
                className="w-full input"
              >
                <option value="">None</option>
                {availableAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-5">
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                To Asset (optional)
              </label>
              <select
                value={newRecurring.to_asset_id}
                onChange={(e) =>
                  setNewRecurring((prev) => ({
                    ...prev,
                    to_asset_id: e.target.value,
                  }))
                }
                className="w-full input"
              >
                <option value="">None</option>
                {availableAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12">
              <div className="flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={handleAddRecurring}
                >
                  Add Recurring Transaction
                </button>
                <button
                  className="btn btn-ghost border border-[var(--border-color)]"
                  onClick={() => setIsAddingRecurring(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Transactions Table */}
      <div className="flex-grow overflow-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead
            className="sticky top-0 z-10"
            style={{ backgroundColor: "var(--bg-surface-secondary)" }}
          >
            <tr>
              <th className="p-3 font-semibold text-sm border-b border-[var(--border-color)] text-[var(--text-primary)]">
                Description
              </th>
              <th className="p-3 font-semibold text-sm border-b border-[var(--border-color)] text-[var(--text-primary)]">
                Amount
              </th>
              <th className="p-3 font-semibold text-sm border-b border-[var(--border-color)] text-[var(--text-primary)]">
                Type
              </th>
              <th className="p-3 font-semibold text-sm border-b border-[var(--border-color)] text-[var(--text-primary)]">
                Period
              </th>
              <th className="p-3 font-semibold text-sm border-b border-[var(--border-color)] text-[var(--text-primary)]">
                From Asset
              </th>
              <th className="p-3 font-semibold text-sm border-b border-[var(--border-color)] text-[var(--text-primary)]">
                To Asset
              </th>
              <th className="p-3 font-semibold text-sm border-b border-[var(--border-color)] text-[var(--text-primary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {wallet.recurring_transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No recurring transactions found
                </td>
              </tr>
            ) : (
              wallet.recurring_transactions.map((recurring) => (
                <tr
                  key={recurring.id}
                  className="hover:bg-[var(--bg-surface-secondary)] transition-colors"
                >
                  <td className="p-3 text-sm text-[var(--text-primary)]">
                    <EditableText
                      value={recurring.description}
                      modifyValue={(value) =>
                        handleUpdateRecurring(
                          recurring.id,
                          "description",
                          value,
                        )
                      }
                    />
                  </td>
                  <td className="p-3 text-sm text-[var(--text-primary)]">
                    <EditableValue
                      value={recurring.amount}
                      modifyValue={(value) =>
                        handleUpdateRecurring(recurring.id, "amount", value)
                      }
                    />
                  </td>
                  <td className="p-3 text-sm">
                    <select
                      value={recurring.type}
                      onChange={(e) =>
                        handleUpdateRecurring(
                          recurring.id,
                          "type",
                          e.target.value as TransactionTypes,
                        )
                      }
                      className="input w-[120px] py-1"
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="fee">Fee</option>
                      <option value="reward">Reward</option>
                    </select>
                  </td>
                  <td className="p-3 text-sm">
                    <select
                      value={recurring.period}
                      onChange={(e) =>
                        handleUpdateRecurring(
                          recurring.id,
                          "period",
                          e.target.value as
                            | "daily"
                            | "weekly"
                            | "monthly"
                            | "yearly",
                        )
                      }
                      className="input w-[100px] py-1"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </td>
                  <td className="p-3 text-sm text-[var(--text-primary)]">
                    {getAssetName(recurring.from_asset_id)}
                  </td>
                  <td className="p-3 text-sm text-[var(--text-primary)]">
                    {getAssetName(recurring.to_asset_id)}
                  </td>
                  <td className="p-3 text-sm">
                    <button
                      className="btn btn-danger btn-small border border-red-500"
                      onClick={() => handleDeleteRecurring(recurring)}
                    >
                      <BsTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md card overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Confirm Delete
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-[var(--text-primary)] mb-4">
                Are you sure you want to delete this recurring transaction?
              </p>
              {recurringToDelete && (
                <div className="p-3 bg-gray-100 rounded mb-4 text-sm text-gray-800">
                  <strong>{recurringToDelete.description}</strong>
                  <br />
                  Amount: {recurringToDelete.amount}
                  <br />
                  Period: {getPeriodLabel(recurringToDelete.period)}
                </div>
              )}
              <div className="p-3 bg-yellow-50 text-yellow-800 rounded text-sm">
                This action cannot be undone.
              </div>
            </div>
            <div className="px-6 py-4 bg-[var(--bg-surface-secondary)] flex justify-end gap-3">
              <button
                className="btn btn-ghost border border-[var(--border-color)]"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete Recurring Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
