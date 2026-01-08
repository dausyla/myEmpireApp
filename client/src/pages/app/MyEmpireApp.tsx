import { useRef } from "react";
import { NavBar } from "./components/Navbar";
import { AssetHierarchy } from "./components/AssetHierarchy/AssetHierarchy";
import { useWindowManager } from "./components/Windows/WindowManager/WindowManager";

export function MyEmpireApp() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { windows, openWindow } = useWindowManager({ containerRef });

  return (
    <>
      <NavBar openWindow={openWindow} />

      <div
        ref={containerRef}
        className="w-full p-0 relative"
        style={{ height: "90vh" }}
      >
        <div className="flex h-full m-0">
          <div className="w-1/6 h-full p-0 hidden md:block">
            <AssetHierarchy />
          </div>
        </div>

        {/* Render Windows */}
        {windows}
      </div>
    </>
  );
}
