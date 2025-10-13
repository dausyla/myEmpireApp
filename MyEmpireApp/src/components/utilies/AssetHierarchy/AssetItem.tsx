import { ListGroup } from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";
import type { Asset } from "../../../types/PortfolioTypes";
import { useAssetContext } from "../../../contexts/AssetContext/AssetContextHook";

export function AssetItem({
  asset,
  depth = 0,
}: {
  asset: Asset;
  depth: number;
}) {
  const { setCurrentAsset } = useAssetContext();
  return (
    <ListGroup.Item
      key={asset.id}
      style={{
        paddingLeft: `${(depth + 1) * 16}px`,
        border: "none",
      }}
      action
      onClick={() => setCurrentAsset(asset)}
      className="d-flex align-items-center"
    >
      <FaFileAlt className="text-secondary me-2" />
      {asset.name}
    </ListGroup.Item>
  );
}
