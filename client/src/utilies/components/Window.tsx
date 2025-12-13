import React, { useState, useRef, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import "./Window.css";

export interface WindowProps {
  title: string;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
  onClose: () => void;
  onFocus?: () => void;
  children: React.ReactNode;
  zIndex?: number;
}

export const Window: React.FC<WindowProps> = ({
  title,
  initialX = 100,
  initialY = 100,
  initialWidth = 1000,
  initialHeight = 500,
  minWidth = 200,
  minHeight = 150,
  minX = 0,
  minY = 0,
  maxX,
  maxY,
  onClose,
  onFocus,
  children,
  zIndex = 1000,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeType, setResizeType] = useState<string>("");

  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, type: "drag" | "resize", resizeDir?: string) => {
      e.preventDefault();

      if (type === "drag") {
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      } else if (type === "resize" && resizeDir) {
        setIsResizing(true);
        setResizeType(resizeDir);
      }
    },
    [position],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        newX = Math.max(
          minX,
          Math.min(newX, (maxX || window.innerWidth) - size.width),
        );
        newY = Math.max(
          minY,
          Math.min(newY, (maxY || window.innerHeight) - size.height),
        );

        setPosition({
          x: newX,
          y: newY,
        });
      } else if (isResizing) {
        const rect = windowRef.current?.getBoundingClientRect();
        if (!rect) return;

        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        if (resizeType.includes("right")) {
          newWidth = Math.max(
            minWidth,
            Math.min(
              e.clientX - rect.left,
              (maxX || window.innerWidth) - position.x,
            ),
          );
        }
        if (resizeType.includes("bottom")) {
          newHeight = Math.max(
            minHeight,
            Math.min(
              e.clientY - rect.top,
              (maxY || window.innerHeight) - position.y,
            ),
          );
        }
        if (resizeType.includes("left")) {
          const deltaX = rect.left - e.clientX;
          const maxDeltaX = position.x - minX;
          const constrainedDeltaX = Math.min(deltaX, maxDeltaX);
          newWidth = Math.max(minWidth, size.width + constrainedDeltaX);
          newX = position.x - (newWidth - size.width);
        }
        if (resizeType.includes("top")) {
          const deltaY = rect.top - e.clientY;
          const maxDeltaY = position.y - minY;
          const constrainedDeltaY = Math.min(deltaY, maxDeltaY);
          newHeight = Math.max(minHeight, size.height + constrainedDeltaY);
          newY = position.y - (newHeight - size.height);
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    },
    [
      isDragging,
      isResizing,
      dragOffset,
      size,
      position,
      resizeType,
      minWidth,
      minHeight,
      minX,
      minY,
      maxX,
      maxY,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeType("");
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-lg overflow-hidden select-none ${isDragging || isResizing ? "select-none" : ""}`}
      onMouseDown={() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onFocus && onFocus();
      }}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
    >
      {/* Title Bar */}
      <div
        className="bg-[var(--brand-gradient)] text-white flex items-center justify-between p-1 cursor-move border-b border-white/10"
        onMouseDown={(e) => handleMouseDown(e, "drag")}
      >
        <div className="text-base font-semibold flex-1 whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-sm px-2">
          {title}
        </div>
        <button
          className="btn btn-danger btn-small btn-round"
          onClick={onClose}
        >
          <IoClose />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[var(--bg-surface)] text-[var(--text-primary)]">
        {children}
      </div>

      {/* Resize Handles */}
      <div
        className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize bg-transparent hover:bg-blue-500/10"
        onMouseDown={(e) => handleMouseDown(e, "resize", "top-left")}
      />
      <div
        className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize bg-transparent hover:bg-blue-500/10"
        onMouseDown={(e) => handleMouseDown(e, "resize", "top-right")}
      />
      <div
        className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize bg-transparent hover:bg-blue-500/10"
        onMouseDown={(e) => handleMouseDown(e, "resize", "bottom-left")}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize bg-transparent hover:bg-blue-500/10"
        onMouseDown={(e) => handleMouseDown(e, "resize", "bottom-right")}
      />

      {/* Edge resize handles */}
      <div
        className="absolute top-0 left-2 right-2 h-1 cursor-n-resize bg-transparent hover:bg-blue-500/10"
        onMouseDown={(e) => handleMouseDown(e, "resize", "top")}
      />
      <div
        className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize bg-transparent hover:bg-blue-500/10"
        onMouseDown={(e) => handleMouseDown(e, "resize", "bottom")}
      />
      <div
        className="absolute top-2 bottom-2 left-0 w-1 cursor-w-resize bg-transparent hover:bg-blue-500/10"
        onMouseDown={(e) => handleMouseDown(e, "resize", "left")}
      />
      <div
        className="absolute top-2 bottom-2 right-0 w-1 cursor-e-resize bg-transparent hover:bg-blue-500/10"
        onMouseDown={(e) => handleMouseDown(e, "resize", "right")}
      />
    </div>
  );
};
