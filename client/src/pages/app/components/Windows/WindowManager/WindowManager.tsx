import React, { useState, useEffect, type JSX } from "react";
import { Window } from "../Window/Window";

export interface ManagedWindow {
  id: string;
  element: JSX.Element;
  title: string;
  initialWidth: number;
  initialHeight: number;
  headerActions?: React.ReactNode;
}

export interface WindowManagerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface WindowManagerReturn {
  windows: JSX.Element;
  openWindow: (
    element: JSX.Element,
    title: string,
    initialWidth: number,
    initialHeight: number,
    headerActions?: React.ReactNode,
  ) => void;
  closeWindow: (id: string) => void;
  windowCount: number;
}

export const useWindowManager = ({
  containerRef,
}: WindowManagerProps): WindowManagerReturn => {
  const [windows, setWindows] = useState<ManagedWindow[]>([]);
  const [containerBounds, setContainerBounds] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  // Calculate container bounds on mount and resize
  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerBounds({
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
        });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [containerRef]);

  const openWindow = (
    element: JSX.Element,
    title: string,
    initialWidth: number,
    initialHeight: number,
    headerActions?: React.ReactNode,
  ) => {
    const id = `window-${Date.now()}`;
    setWindows((prev) => [
      ...prev,
      { id, element, title, initialWidth, initialHeight, headerActions },
    ]);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  // Calculate boundaries
  const hierarchyWidth = containerBounds.width * (2 / 12);
  const minX = containerBounds.left + hierarchyWidth + 1;
  const maxX = containerBounds.left + containerBounds.width - 1;
  const minY = 1;
  const maxY = containerBounds.height - 1;

  const bringToFront = (id: string) => {
    setWindows((prev) => {
      const windowIndex = prev.findIndex((w) => w.id === id);
      if (windowIndex === -1 || windowIndex === prev.length - 1) return prev;

      const newWindows = [...prev];
      const [windowToMove] = newWindows.splice(windowIndex, 1);
      newWindows.push(windowToMove);
      return newWindows;
    });
  };

  // Track window bounds for snapping
  const windowBoundsRef = React.useRef<
    Record<string, { x: number; y: number; width: number; height: number }>
  >({});

  const updateWindowBounds = (
    id: string,
    bounds: { x: number; y: number; width: number; height: number },
  ) => {
    windowBoundsRef.current[id] = bounds;
  };

  const getOtherWindowBounds = (id: string) => {
    return Object.entries(windowBoundsRef.current)
      .filter(([key]) => key !== id)
      .map(([, bounds]) => bounds);
  };

  const renderedWindows = (
    <>
      {windows.map((win, index) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          initialX={minX + 50 + index * 30} // Stagger windows
          initialY={20 + index * 30}
          initialWidth={win.initialWidth}
          initialHeight={win.initialHeight}
          minX={minX}
          minY={minY}
          maxX={maxX}
          maxY={maxY}
          onClose={() => {
            delete windowBoundsRef.current[win.id];
            closeWindow(win.id);
          }}
          onFocus={() => bringToFront(win.id)}
          zIndex={1000 + index}
          headerActions={win.headerActions}
          onBoundsUpdate={(bounds) => updateWindowBounds(win.id, bounds)}
          getOtherWindowBounds={() => getOtherWindowBounds(win.id)}
          containerOffset={{ x: containerBounds.left, y: containerBounds.top }}
        >
          {win.element}
        </Window>
      ))}
    </>
  );

  return {
    windows: renderedWindows,
    openWindow,
    closeWindow,
    windowCount: windows.length,
  };
};
