import { useState } from "react";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import toast from "react-hot-toast";

export function NoAssetComponent() {
  const { addAsset } = useBatch();
  const { wallet } = useWallet();

  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    const rootDirId = wallet?.dirs[0].id;
    if (!rootDirId) {
      toast.error("No root directory found...");
      return;
    }
    addAsset({
      name: newName,
      dir_id: rootDirId,
      color: "#ff0000",
      estimated_apy: 0,
      // TODO: Remove that
      count_first_input: false,
    });
    setNewName("");
  };

  return (
    <div className="flex justify-center items-center mt-12">
      <div
        className="w-[22rem] shadow-lg rounded-lg border border-[var(--border-color)] overflow-hidden"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <div
          className="px-4 py-3 border-b border-[var(--border-color)] font-medium"
          style={{ backgroundColor: "var(--bg-surface-secondary)" }}
        >
          No Assets Found
        </div>
        <div className="p-5">
          <h5 className="text-xl font-medium mb-4 text-[var(--text-primary)]">
            Create a New Asset
          </h5>
          <div className="mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter a name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              style={{
                backgroundColor: "var(--bg-surface-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="w-full px-4 py-2 bg-[var(--brand-primary)] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            style={{ background: "var(--brand-gradient)" }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
