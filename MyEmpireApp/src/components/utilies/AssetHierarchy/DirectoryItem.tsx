import { ListGroup, ButtonGroup, Button } from "react-bootstrap";
import type { Directory } from "../../../types/PortfolioTypes";
import { FaFolder, FaFolderOpen, FaTrash, FaFileAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { AssetItem } from "./AssetItem";
import { useAssetContext } from "../../../contexts/AssetContext/AssetContextHook";
import { useState } from "react";

interface DirectoryItemProps {
  dir: Directory;
  depth?: number;
  toggleDirectory: (dir: Directory) => void;
}

export function DirectoryItem({
  dir,
  depth = 0,
  toggleDirectory,
}: DirectoryItemProps) {
  const { addNewAsset, addNewDir, deleteDir } = useAssetContext();
  const [hovered, setHovered] = useState(false);

  const handleAddDir = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggleDirectory()
    addNewDir({ fromDir: dir });
  };

  const handleAddAsset = (e: React.MouseEvent) => {
    e.stopPropagation();
    addNewAsset({ fromDir: dir });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDir(dir);
  };

  const subDirs = dir.subDirs.map((sub) => (
    <DirectoryItem
      key={sub.id}
      dir={sub}
      depth={depth + 1}
      toggleDirectory={toggleDirectory}
    />
  ));

  const subAssets = dir.subAssets.map((a) => (
    <AssetItem key={a.id} asset={a} depth={depth} />
  ));

  return (
    <>
      {/* Directory line */}
      {dir.id !== 0 && (
        <ListGroup.Item
          action
          onClick={() => toggleDirectory(dir)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="d-flex align-items-center justify-content-between"
          style={{
            paddingLeft: `${depth * 16}px`,
            background: "light",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <div className="d-flex align-items-center">
            {dir.isOpened ? (
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
        {(dir.isOpened || dir.id === 0) && (
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
