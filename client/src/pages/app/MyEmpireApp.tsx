import { Button, Col, Container, Row } from "react-bootstrap";
import { Assets } from "./components/assets/Assets";
import { useWallet } from "../../contexts/WalletContext/WalletContextHook";
// import { SelectWallet } from "./components/SelectWallet";
import { useState, useRef } from "react";
import { NavBar } from "./components/Navbar";
import { AssetHierarchy } from "./components/AssetHierarchy/AssetHierarchy";
import { useWindowManager } from "../../utilies/components/WindowManager";
// import { Dashboard } from "./components/dashboard/Dashboard";
// import { Predictions } from "./components/predictions/Predictions";

export function MyEmpireApp() {
  // const { wallet } = useWallet();
  const [currentNav, setCurrentNav] = useState("dashboard");
  const containerRef = useRef<HTMLDivElement>(null);

  const { windows, openWindow } = useWindowManager({ containerRef });

  return (
    <>
      <NavBar setCurrentNav={setCurrentNav} />

      <Container
        ref={containerRef}
        fluid
        className="p-0"
        style={{ height: "90vh", position: "relative" }}
      >
        <Row className="h-100 m-0">
          <Col md={2} className="h-100 p-0">
            <AssetHierarchy />
          </Col>
        </Row>

        {/* New Window Button - Absolutely positioned */}
        <Button
          onClick={() => openWindow(<Assets />, "Assets")}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1001,
          }}
        >
          New Window
        </Button>

        {/* Render Windows */}
        {windows}
      </Container>
    </>
  );
}
