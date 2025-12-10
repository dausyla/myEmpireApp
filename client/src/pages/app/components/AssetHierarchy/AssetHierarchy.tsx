import { DirectoryItem } from "./DirectoryItem";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";

export function AssetHierarchy() {
  const { wallet } = useWallet();
  const {} = useBatch();

  if (!wallet) return null;

  const root = wallet.dirs.find((d) => !d.parent_dir_id);

  if (!root) {
    console.log("No root dir...");
    return null;
  }

  return (
    <div
      className="h-full flex flex-col border-r"
      style={{
        backgroundColor: "var(--bg-surface-secondary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div
        className="p-2 border-b"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <button
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1 rounded text-sm font-medium transition-colors hover:bg-[var(--bg-surface-secondary)] hover:text-[#e94057]"
              style={{ color: "var(--text-primary)" }}
              // onClick={() => addNewAsset({})}
            >
              <FaFileAlt /> New Asset
            </button>
          </div>
          <div>
            <button
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1 rounded text-sm font-medium transition-colors hover:bg-[var(--bg-surface-secondary)] hover:text-[#e94057]"
              style={{ color: "var(--text-primary)" }}
              // onClick={() => addNewDir({})}
            >
              <FaFolder /> New Dir
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="p-0">
          <DirectoryItem dir={root} />
        </div>
      </div>
    </div>
  );
}
