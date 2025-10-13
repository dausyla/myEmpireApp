import { NavBar } from "../navbar/Navbar";
import { useState } from "react";
import { Predictions } from "./myEmpireAppComponents/Predictions";
import { Assets } from "./myEmpireAppComponents/Assets";
import { usePortfolio } from "../../contexts/PortfolioContext/PortfolioContextHook";
import { Dashboard } from "./myEmpireAppComponents/Dashboard";
import { NoPortfolio } from "./myEmpireAppComponents/NoPortfolio";
import { Col, Container, Row } from "react-bootstrap";
import { AssetHierarchy } from "../utilies/AssetHierarchy/AssetHierarchy";

export function MyEmpireApp() {
  const [currentNav, setCurrentNav] = useState("dashboard");
  const { portfolio } = usePortfolio();

  if (!portfolio) return <NoPortfolio />;

  return (
    <>
      <NavBar setCurrentNav={setCurrentNav} />

      <Container>
        <Row>
          <Col md={2}>
            <AssetHierarchy />
          </Col>
          <Col>
            {currentNav === "dashboard" && <Dashboard />}
            {currentNav === "predictions" && <Predictions />}
            {currentNav === "assets" && <Assets />}
          </Col>
        </Row>
      </Container>
    </>
  );
}
