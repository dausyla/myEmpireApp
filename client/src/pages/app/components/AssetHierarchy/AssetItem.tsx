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
      className={`hierarchy-item ${currentItemId?.id === asset.id ? "active" : ""}`}
      style={{ paddingLeft: `${(depth + 1) * 16 + 12}px` }}
      onClick={() => setCurrentItemId({ type: "asset", id: asset.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="hierarchy-item-content">
        <FaFileAlt className="text-secondary" style={{ fontSize: "0.9em" }} />
        <span className="hierarchy-item-text">{asset.name}</span>
      </div>
      {/* Action buttons (visible on hover) */}
      <div className="hierarchy-actions">
        <button
          title="Supprimer le fichier"
          className="hierarchy-action-btn danger"
          onClick={handleDelete}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
