import { Button, ButtonGroup, ListGroup } from "react-bootstrap";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import type { Asset } from "../../types/WalletTypes";
import { useAssetContext } from "../../contexts/AssetContext/AssetContextHook";
import { useState } from "react";

export function AssetItem({
  asset,
  depth = 0,
}: {
  asset: Asset;
  depth: number;
}) {
  const { setCurrentAsset, deleteAsset } = useAssetContext();
  const [hovered, setHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAsset(asset);
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
      }}
      action
      onClick={() => setCurrentAsset(asset)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`d-flex align-items-center justify-content-between bg-body${
        hovered ? "" : "-tertiary"
      }`}
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
