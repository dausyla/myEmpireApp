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
      const rect = windowRef.current?.getBoundingClientRect();

      if (type === "drag" && rect) {
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      } else if (type === "resize" && resizeDir) {
        setIsResizing(true);
        setResizeType(resizeDir);
      }
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (isResizing) {
        const rect = windowRef.current?.getBoundingClientRect();
        if (!rect) return;

        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        if (resizeType.includes("right")) {
          newWidth = Math.max(minWidth, e.clientX - rect.left);
        }
        if (resizeType.includes("bottom")) {
          newHeight = Math.max(minHeight, e.clientY - rect.top);
        }
        if (resizeType.includes("left")) {
          const deltaX = rect.left - e.clientX;
          newWidth = Math.max(minWidth, size.width + deltaX);
          newX = position.x - (newWidth - size.width);
        }
        if (resizeType.includes("top")) {
          const deltaY = rect.top - e.clientY;
          newHeight = Math.max(minHeight, size.height + deltaY);
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
