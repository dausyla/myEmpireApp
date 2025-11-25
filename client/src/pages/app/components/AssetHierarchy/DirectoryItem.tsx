import { ListGroup, ButtonGroup, Button } from "react-bootstrap";
import { FaFolder, FaFolderOpen, FaTrash, FaFileAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { AssetItem } from "./AssetItem";
import { useState } from "react";
import type { Directory } from "@shared/WalletTypes";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";

interface DirectoryItemProps {
  dir: Directory;
  depth?: number;
}

export function DirectoryItem({ dir, depth = 0 }: DirectoryItemProps) {
  const { wallet } = useWallet();
  const [isOpened, setIsOpened] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addDir, addAsset, deleteDir } = useBatch();

  if (!wallet) return null;

  const handleAddDir = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggleDirectory()
    addDir({
      name: "New directory",
      wallet_id: wallet.wallet.id,
      description: "My directory description",
      parent_dir_id: dir.id,
    });
  };

  const handleAddAsset = (e: React.MouseEvent) => {
    e.stopPropagation();
    addAsset({
      name: "New Asset",
      dir_id: dir.id,
      color: "#ff0000",
      estimated_apy: 0,
      count_first_input: false,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDir(dir.id);
  };

  const subDirs = wallet.dirs
    .filter((d) => d.parent_dir_id === dir.id)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((sub) => <DirectoryItem key={sub.id} dir={sub} depth={depth + 1} />);

  const subAssets = wallet.assets
    .filter((a) => a.dir_id === dir.id)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((a) => <AssetItem key={a.id} asset={a} depth={depth} />);

  return (
    <>
      {/* Directory line */}
      {dir.id !== 0 && (
        <ListGroup.Item
          action
          onClick={() => setIsOpened(!isOpened)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`d-flex align-items-center justify-content-between bg-body${
            hovered ? "" : "-tertiary"
          }`}
          style={{
            paddingTop: "2px",
            paddingBottom: "2px",
            paddingLeft: `${depth * 16}px`,
            border: "none",
            borderRadius: 0,
          }}
        >
          <div className="d-flex align-items-center">
            {isOpened ? (
              <FaFolderOpen className="text-warning me-2" />
            ) : (
              <FaFolder className="text-warning me-2" />
            )}
            <span>{dir.name}</span>
          </div>

          {/* Action buttons (visible on hover) */}
          {hovered && (
            <ButtonGroup size="sm">
              <Button
                variant="light"
                title="Ajouter un dossier"
                className="p-0"
                onClick={handleAddDir}
              >
                <FaFolder className="text-success m-1" />
              </Button>
              <Button
                variant="light"
                title="Ajouter un fichier"
                className="p-0"
                onClick={handleAddAsset}
              >
                <FaFileAlt className="text-primary m-1" />
              </Button>
              <Button
                variant="light"
                title="Supprimer le dossier"
                className="p-0"
                onClick={handleDelete}
              >
                <FaTrash className="text-danger m-1" />
              </Button>
            </ButtonGroup>
          )}
        </ListGroup.Item>
      )}

      {/* Subdirectories and assets */}
      <AnimatePresence initial={false}>
        {(isOpened || dir.id === 0) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {subDirs}
            {subAssets}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
