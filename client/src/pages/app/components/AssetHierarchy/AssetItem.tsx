import { FaFileAlt, FaTrash } from "react-icons/fa";
import { useState } from "react";
import type { Asset } from "@shared/WalletTypes";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";

export function AssetItem({
  asset,
  depth = 0,
}: {
  asset: Asset;
  depth: number;
}) {
  const { deleteAsset } = useBatch();
  const { currentItemId, setCurrentItemId } = useApp();
  const [, setHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAsset(asset.id);
  };
  return (
    <div
      key={asset.id}
      className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors border-l-[3px] border-transparent hover:bg-white/5 text-[0.9rem] ${
        currentItemId?.id === asset.id
          ? "border-l-[#e94057] bg-white/5 text-[var(--text-primary)]"
          : "text-[var(--text-primary)]"
      }`}
      style={{ paddingLeft: `${(depth + 1) * 16 + 12}px` }}
      onClick={() => setCurrentItemId({ type: "asset", id: asset.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2">
        <FaFileAlt
          className="text-[var(--text-secondary)]"
          style={{ fontSize: "0.9em" }}
        />
        <span className="truncate">{asset.name}</span>
      </div>
      {/* Action buttons (visible on hover) */}
      <div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          title="Supprimer le fichier"
          className="btn btn-danger btn-small"
          onClick={handleDelete}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
