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
          className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors border-l-[3px] border-transparent hover:bg-gray-500/15 text-[0.9rem] text-(--text-primary)`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => setIsOpened(!isOpened)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            {isOpened ? (
              <FaFolderOpen className="text-yellow-500" />
            ) : (
              <FaFolder className="text-yellow-500" />
            )}
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {dir.name}
            </span>
          </div>

          {/* Action buttons (visible on hover) */}
          <div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              title="Ajouter un dossier"
              className="btn btn-primary btn-small"
              onClick={handleAddDir}
            >
              <FaFolder />
            </button>
            <button
              title="Ajouter un fichier"
              className="btn btn-success btn-small"
              onClick={handleAddAsset}
            >
              <FaFileAlt />
            </button>
            <button
              title="Supprimer le dossier"
              className="btn btn-danger btn-small"
              onClick={handleDelete}
              disabled={depth === 0}
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
