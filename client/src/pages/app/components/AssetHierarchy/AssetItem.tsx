import { Button, ButtonGroup, ListGroup } from "react-bootstrap";
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
  const { setCurrentItemId } = useApp();
  const [hovered, setHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAsset(asset.id);
  };
  return (
    <ListGroup.Item
      key={asset.id}
      style={{
        paddingTop: "2px",
        paddingBottom: "2px",
        paddingLeft: `${(depth + 1) * 16}px`,
        border: "none",
        borderRadius: 0,
        backgroundColor: hovered
          ? "var(--bg-surface-secondary)"
          : "transparent",
        color: "var(--text-primary)",
      }}
      action
      onClick={() => setCurrentItemId({ type: "asset", id: asset.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="d-flex align-items-center">
        <FaFileAlt className="text-secondary me-2" />
        {asset.name}
      </div>
      {/* Action buttons (visible on hover) */}
      {hovered && (
        <ButtonGroup size="sm">
          <Button
            title="Supprimer le dossier"
            variant="light"
            className="p-0"
            onClick={handleDelete}
          >
            <FaTrash className="text-danger m-1" />
          </Button>
        </ButtonGroup>
      )}
    </ListGroup.Item>
  );
}
