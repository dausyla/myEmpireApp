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
  children: React.ReactNode;
  zIndex?: number;
}

export const Window: React.FC<WindowProps> = ({
  title,
  initialX = 100,
  initialY = 100,
  initialWidth = 400,
  initialHeight = 300,
  minWidth = 200,
  minHeight = 150,
  minX = 0,
  minY = 0,
  maxX,
  maxY,
  onClose,
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
        // Calculate offset from the current mouse position to the window's current position
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

        // Apply boundary constraints
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
      className="window"
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
        className="window-title-bar"
        onMouseDown={(e) => handleMouseDown(e, "drag")}
      >
        <div className="window-title">{title}</div>
        <button className="window-close-btn" onClick={onClose}>
          <IoClose />
        </button>
      </div>

      {/* Content */}
      <div className="window-content">{children}</div>

      {/* Resize Handles */}
      <div
        className="resize-handle resize-handle-nw"
        onMouseDown={(e) => handleMouseDown(e, "resize", "top-left")}
      />
      <div
        className="resize-handle resize-handle-ne"
        onMouseDown={(e) => handleMouseDown(e, "resize", "top-right")}
      />
      <div
        className="resize-handle resize-handle-sw"
        onMouseDown={(e) => handleMouseDown(e, "resize", "bottom-left")}
      />
      <div
        className="resize-handle resize-handle-se"
        onMouseDown={(e) => handleMouseDown(e, "resize", "bottom-right")}
      />

      {/* Edge resize handles */}
      <div
        className="resize-handle resize-handle-n"
        onMouseDown={(e) => handleMouseDown(e, "resize", "top")}
      />
      <div
        className="resize-handle resize-handle-s"
        onMouseDown={(e) => handleMouseDown(e, "resize", "bottom")}
      />
      <div
        className="resize-handle resize-handle-w"
        onMouseDown={(e) => handleMouseDown(e, "resize", "left")}
      />
      <div
        className="resize-handle resize-handle-e"
        onMouseDown={(e) => handleMouseDown(e, "resize", "right")}
      />
    </div>
  );
};
