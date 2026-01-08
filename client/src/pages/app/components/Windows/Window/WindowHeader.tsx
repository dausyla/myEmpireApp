import React from "react";
import { IoClose } from "react-icons/io5";

interface WindowHeaderProps {
  title: string;
  headerActions?: React.ReactNode;
  internalHeaderActions?: React.ReactNode;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  headerActions,
  internalHeaderActions,
  onClose,
  onMouseDown,
}) => {
  return (
    <div
      className="text-white flex items-center justify-between p-1 cursor-move border-b border-white/10 shadow-sm z-20 relative"
      style={{ background: "var(--bg-surface-secondary)" }}
      onMouseDown={onMouseDown}
    >
      <div
        className="text-base font-semibold flex-1 whitespace-nowrap overflow-hidden text-ellipsis px-2 text-left"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </div>
      <div
        className="flex items-center gap-2"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {headerActions}
        {internalHeaderActions}
        <button
          className="btn btn-danger btn-small btn-round"
          onClick={onClose}
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
};
