import { NavBar } from "./components/Navbar";
import { useState } from "react";
import { Predictions } from "./components/predictions/Predictions";
import { Assets } from "./components/assets/Assets";
import { usePortfolio } from "../../contexts/PortfolioContext/PortfolioContextHook";
import { Dashboard } from "./components/dashboard/Dashboard";
import { NoPortfolio } from "./components/NoPortfolio";
import { Col, Container, Row } from "react-bootstrap";
import { AssetHierarchy } from "../../utilies/AssetHierarchy/AssetHierarchy";

export function MyEmpireApp() {
  const [currentNav, setCurrentNav] = useState("dashboard");
  const { portfolio } = usePortfolio();

  if (!portfolio) return <NoPortfolio />;

  return (
    <>
      <NavBar setCurrentNav={setCurrentNav} />

      <Container fluid className="p-0" style={{ height: "90vh" }}>
        <Row className="h-100 m-0">
          <Col md={2} className="h-100 p-0">
            <AssetHierarchy />
          </Col>
          <Col className="h-100 p-0">
            {currentNav === "dashboard" && <Dashboard />}
            {currentNav === "predictions" && <Predictions />}
            {currentNav === "assets" && <Assets />}
          </Col>
        </Row>
      </Container>
    </>
  );
}
