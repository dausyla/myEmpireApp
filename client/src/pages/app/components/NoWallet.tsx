import { useState } from "react";
import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";

export function NoWallet() {
  const { createWallet } = useWallet();

  // TODO
  // const [useExample, setUseExample] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreate = () => {
    const name = !newName.trim() ? "New Portfolio" : newName;
    const desc = !newDesc.trim() ? "Portfolio Description" : newDesc;
    createWallet(name, desc);
  };

  return (
    <>
      <div
        className="w-[22rem] shadow-lg rounded-lg border border-[var(--border-color)] overflow-hidden mx-auto"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <div className="p-5">
          <h5 className="text-xl font-medium mb-4 text-[var(--text-primary)]">
            Create a New Portfolio
          </h5>
          <div className="mb-4 space-y-3">
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

            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Enter a description"
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

            {/* Option to choose between empty or example portfolio put on the right */}
            {/* <div className="flex justify-end mt-2">
                <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  Use Example Portfolio
                  <input
                    type="checkbox"
                    checked={useExample}
                    onChange={() => setUseExample(!useExample)}
                    className="rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                  />
                </label>
              </div> */}
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
    </>
  );
}
