import React from "react";

interface WindowResizeHandlesProps {
  onMouseDown: (e: React.MouseEvent, direction: string) => void;
}

export const WindowResizeHandles: React.FC<WindowResizeHandlesProps> = ({
  onMouseDown,
}) => {
  return (
    <>
      {/* Resize Handles */}
      <div
        className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize bg-transparent hover:bg-blue-500/10 z-50"
        onMouseDown={(e) => onMouseDown(e, "top-left")}
      />
      <div
        className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize bg-transparent hover:bg-blue-500/10 z-50"
        onMouseDown={(e) => onMouseDown(e, "top-right")}
      />
      <div
        className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize bg-transparent hover:bg-blue-500/10 z-50"
        onMouseDown={(e) => onMouseDown(e, "bottom-left")}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize bg-transparent hover:bg-blue-500/10 z-50"
        onMouseDown={(e) => onMouseDown(e, "bottom-right")}
      />

      {/* Edge resize handles */}
      <div
        className="absolute top-0 left-2 right-2 h-1 cursor-n-resize bg-transparent hover:bg-blue-500/10 z-50"
        onMouseDown={(e) => onMouseDown(e, "top")}
      />
      <div
        className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize bg-transparent hover:bg-blue-500/10 z-50"
        onMouseDown={(e) => onMouseDown(e, "bottom")}
      />
      <div
        className="absolute top-2 bottom-2 left-0 w-1 cursor-w-resize bg-transparent hover:bg-blue-500/10 z-50"
        onMouseDown={(e) => onMouseDown(e, "left")}
      />
      <div
        className="absolute top-2 bottom-2 right-0 w-1 cursor-e-resize bg-transparent hover:bg-blue-500/10 z-50"
        onMouseDown={(e) => onMouseDown(e, "right")}
      />
    </>
  );
};
