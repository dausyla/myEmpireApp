import { useState, useEffect, type JSX } from "react";
import { Window } from "./Window";

export interface ManagedWindow {
  id: string;
  element: JSX.Element;
  title: string;
  initialWidth: number;
  initialHeight: number;
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
  ) => {
    const id = `window-${Date.now()}`;
    setWindows((prev) => [
      ...prev,
      { id, element, title, initialWidth, initialHeight },
    ]);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  // Calculate boundaries
  const hierarchyWidth = containerBounds.width * (2 / 12);
  const minX = containerBounds.left + hierarchyWidth + 10;
  const maxX = containerBounds.left + containerBounds.width - 10;
  const maxY = containerBounds.height - 10;

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

  const renderedWindows = (
    <>
      {windows.map((win, index) => (
        <Window
          key={win.id}
          title={win.title}
          initialX={minX + 50 + index * 30} // Stagger windows
          initialY={20 + index * 30}
          initialWidth={win.initialWidth}
          initialHeight={win.initialHeight}
          minX={minX}
          minY={10}
          maxX={maxX}
          maxY={maxY}
          onClose={() => closeWindow(win.id)}
          onFocus={() => bringToFront(win.id)}
          zIndex={1000 + index}
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
