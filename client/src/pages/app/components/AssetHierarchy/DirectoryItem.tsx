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
  const [, setHovered] = useState(false);
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
        <div
          className={`hierarchy-item ${isOpened ? "expanded" : ""}`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => setIsOpened(!isOpened)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="hierarchy-item-content">
            {isOpened ? (
              <FaFolderOpen className="text-warning" />
            ) : (
              <FaFolder className="text-warning" />
            )}
            <span className="hierarchy-item-text">{dir.name}</span>
          </div>

          {/* Action buttons (visible on hover) */}
          <div className="hierarchy-actions">
            <button
              title="Ajouter un dossier"
              className="hierarchy-action-btn success"
              onClick={handleAddDir}
            >
              <FaFolder />
            </button>
            <button
              title="Ajouter un fichier"
              className="hierarchy-action-btn primary"
              onClick={handleAddAsset}
            >
              <FaFileAlt />
            </button>
            <button
              title="Supprimer le dossier"
              className="hierarchy-action-btn danger"
              onClick={handleDelete}
            >
              <FaTrash />
            </button>
          </div>
        </div>
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
