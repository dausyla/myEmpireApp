import React, { useState, useRef, useCallback } from "react";
import "./Window.css";
import { WindowContext } from "../WindowContext";
import { WindowHeader } from "./WindowHeader";
import { WindowResizeHandles } from "./WindowResizeHandles";

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
  id?: string;
  onBoundsUpdate?: (bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  getOtherWindowBounds?: () => {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  headerActions?: React.ReactNode;
  containerOffset?: { x: number; y: number };
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
  headerActions,
  onBoundsUpdate,
  getOtherWindowBounds,
  containerOffset = { x: 0, y: 0 },
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
  const [internalHeaderActions, setInternalHeaderActions] =
    useState<React.ReactNode>(null);

  const windowRef = useRef<HTMLDivElement>(null);

  // Update bounds on mount and when position/size changes
  React.useEffect(() => {
    if (onBoundsUpdate) {
      onBoundsUpdate({ ...position, ...size });
    }
  }, [position, size, onBoundsUpdate]);

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

        const SNAP_THRESHOLD = 10;
        const otherBounds = getOtherWindowBounds ? getOtherWindowBounds() : [];

        // Calculate mouse position relative to the container
        const mouseContainerX = e.clientX - containerOffset.x;
        const mouseContainerY = e.clientY - containerOffset.y;

        if (resizeType.includes("right")) {
          let targetX = mouseContainerX;
          // Snap to other windows' left or right edges
          for (const bounds of otherBounds) {
            if (Math.abs(targetX - bounds.x) < SNAP_THRESHOLD) {
              targetX = bounds.x;
            } else if (
              Math.abs(targetX - (bounds.x + bounds.width)) < SNAP_THRESHOLD
            ) {
              targetX = bounds.x + bounds.width;
            }
          }

          // Convert back to viewport coordinates for width calculation if needed,
          // but here we calculate width based on container-relative positions which is cleaner
          // actually rect.left is viewport relative.
          // Let's stick to calculating newWidth based on the difference or absolute positions.
          // If we use targetX (container relative), we should compare it to position.x (container relative).

          newWidth = Math.max(
            minWidth,
            Math.min(
              targetX - position.x,
              (maxX || window.innerWidth) - position.x,
            ),
          );
        }
        if (resizeType.includes("bottom")) {
          let targetY = mouseContainerY;
          // Snap to other windows' top or bottom edges
          for (const bounds of otherBounds) {
            if (Math.abs(targetY - bounds.y) < SNAP_THRESHOLD) {
              targetY = bounds.y;
            } else if (
              Math.abs(targetY - (bounds.y + bounds.height)) < SNAP_THRESHOLD
            ) {
              targetY = bounds.y + bounds.height;
            }
          }

          newHeight = Math.max(
            minHeight,
            Math.min(
              targetY - position.y,
              (maxY || window.innerHeight) - position.y,
            ),
          );
        }
        if (resizeType.includes("left")) {
          let targetX = mouseContainerX;
          // Snap to other windows' left or right edges
          for (const bounds of otherBounds) {
            if (Math.abs(targetX - bounds.x) < SNAP_THRESHOLD) {
              targetX = bounds.x;
            } else if (
              Math.abs(targetX - (bounds.x + bounds.width)) < SNAP_THRESHOLD
            ) {
              targetX = bounds.x + bounds.width;
            }
          }

          const deltaX = position.x - targetX;
          const maxDeltaX = position.x - minX;
          const constrainedDeltaX = Math.min(deltaX, maxDeltaX);
          newWidth = Math.max(minWidth, size.width + constrainedDeltaX);
          newX = position.x - (newWidth - size.width);
        }
        if (resizeType.includes("top")) {
          let targetY = mouseContainerY;
          // Snap to other windows' top or bottom edges
          for (const bounds of otherBounds) {
            if (Math.abs(targetY - bounds.y) < SNAP_THRESHOLD) {
              targetY = bounds.y;
            } else if (
              Math.abs(targetY - (bounds.y + bounds.height)) < SNAP_THRESHOLD
            ) {
              targetY = bounds.y + bounds.height;
            }
          }

          const deltaY = position.y - targetY;
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
      getOtherWindowBounds,
      containerOffset,
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
      className={`absolute flex flex-col card shadow-lg select-none ${isDragging || isResizing ? "select-none" : ""}`}
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
      <WindowContext.Provider
        value={{ setHeaderActions: setInternalHeaderActions }}
      >
        <WindowHeader
          title={title}
          headerActions={headerActions}
          internalHeaderActions={internalHeaderActions}
          onClose={onClose}
          onMouseDown={(e) => handleMouseDown(e, "drag")}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto bg-[var(--bg-surface)] text-[var(--text-primary)]">
          {children}
        </div>
      </WindowContext.Provider>

      <WindowResizeHandles
        onMouseDown={(e, direction) => handleMouseDown(e, "resize", direction)}
      />
    </div>
  );
};
