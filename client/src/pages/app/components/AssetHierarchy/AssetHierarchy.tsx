import { DirectoryItem } from "./DirectoryItem";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";

export function AssetHierarchy() {
  const { wallet } = useWallet();
  const { addAsset, addDir } = useBatch();

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
      <div className="p-1 border-b card rounded-none border-x-0 border-t-0 shadow-none">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <button
              className="w-full btn btn-ghost hover:text-[#e94057]"
              onClick={() =>
                addAsset({
                  dir_id: root.id,
                  name: "New Asset",
                  color: "#e94057",
                  estimated_apy: 0,
                  count_first_input: false,
                })
              }
            >
              <FaFileAlt /> New Asset
            </button>
          </div>
          <div>
            <button
              className="w-full btn btn-ghost hover:text-[#e94057]"
              onClick={() =>
                addDir({
                  wallet_id: wallet.wallet.id,
                  name: "New Dir",
                  description: "",
                  parent_dir_id: root.id,
                })
              }
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
