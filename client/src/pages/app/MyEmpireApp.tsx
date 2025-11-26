import { Col, Container, Row } from "react-bootstrap";
import { useRef } from "react";
import { NavBar } from "./components/Navbar";
import { AssetHierarchy } from "./components/AssetHierarchy/AssetHierarchy";
import { useWindowManager } from "../../utilies/components/WindowManager";

export function MyEmpireApp() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { windows, openWindow } = useWindowManager({ containerRef });

  return (
    <>
      <NavBar openWindow={openWindow} />

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

        {/* Render Windows */}
        {windows}
      </Container>
    </>
  );
}
