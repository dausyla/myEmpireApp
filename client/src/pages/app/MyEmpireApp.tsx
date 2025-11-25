import { Col, Container, Row } from "react-bootstrap";
import { Assets } from "./components/assets/Assets";
import { useWallet } from "../../contexts/WalletContext/WalletContextHook";
import { SelectWallet } from "./components/SelectWallet";
import { useState } from "react";
import { NavBar } from "./components/Navbar";
import { AssetHierarchy } from "./components/AssetHierarchy/AssetHierarchy";
import { Window } from "../../utilies/components/Window";
// import { Dashboard } from "./components/dashboard/Dashboard";
// import { Predictions } from "./components/predictions/Predictions";

export function MyEmpireApp() {
  const { wallet } = useWallet();
  const [currentNav, setCurrentNav] = useState("dashboard");
  const [windows, setWindows] = useState<
    Array<{ id: string; title: string; x: number; y: number }>
  >([]);

  const openWindow = (title: string) => {
    const id = `window-${Date.now()}`;
    setWindows((prev) => [
      ...prev,
      {
        id,
        title,
        x: 100 + prev.length * 50,
        y: 100 + prev.length * 50,
      },
    ]);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <>
      <NavBar setCurrentNav={setCurrentNav} />

      <Container
        fluid
        className="p-0"
        style={{ height: "90vh", position: "relative" }}
      >
        <Row className="h-100 m-0">
          <Col md={2} className="h-100 p-0">
            <AssetHierarchy />
          </Col>
          {wallet ? (
            <Col className="h-100 p-0">
              {/* {currentNav === "dashboard" && <Dashboard />} */}
              {/* {currentNav === "predictions" && <Predictions />} */}
              {currentNav === "assets" && <Assets />}

              {/* Example buttons to open windows */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1001,
                }}
              >
                <button
                  onClick={() => openWindow("Asset Details")}
                  style={{ marginRight: 10, padding: "5px 10px" }}
                >
                  Open Asset Window
                </button>
                <button
                  onClick={() => openWindow("Portfolio Analysis")}
                  style={{ padding: "5px 10px" }}
                >
                  Open Analysis Window
                </button>
              </div>
            </Col>
          ) : (
            <SelectWallet />
          )}
        </Row>

        {/* Render Windows */}
        {windows.map((win) => (
          <Window
            key={win.id}
            title={win.title}
            initialX={win.x}
            initialY={win.y}
            onClose={() => closeWindow(win.id)}
            zIndex={1000 + windows.indexOf(win)}
          >
            <div style={{ padding: "20px", height: "100%" }}>
              <h4>{win.title}</h4>
              <p>
                This is the content of the {win.title.toLowerCase()} window.
              </p>
              <p>You can put any React components here!</p>
              <p>The window is fully resizable and draggable.</p>
            </div>
          </Window>
        ))}
      </Container>
    </>
  );
}
