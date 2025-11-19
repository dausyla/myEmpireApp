import { Col, Container, Row } from "react-bootstrap";
import { Assets } from "./components/assets/Assets";
import { useWallet } from "../../contexts/WalletContext/WalletContextHook";
import { SelectWallet } from "./components/SelectWallet";
import { useState } from "react";
import { NavBar } from "./components/Navbar";
// import { Dashboard } from "./components/dashboard/Dashboard";
// import { Predictions } from "./components/predictions/Predictions";

export function MyEmpireApp() {
  const { wallet } = useWallet();
  const [currentNav, setCurrentNav] = useState("dashboard");

  return (
    <>
      <NavBar setCurrentNav={setCurrentNav} />

      <Container fluid className="p-0" style={{ height: "90vh" }}>
        <Row className="h-100 m-0">
          {wallet ? (
            <Col className="h-100 p-0">
              {/* {currentNav === "dashboard" && <Dashboard />} */}
              {/* {currentNav === "predictions" && <Predictions />} */}
              {currentNav === "assets" && <Assets />}
            </Col>
          ) : (
            <SelectWallet />
          )}
          {/* <Col md={2} className="h-100 p-0">
            <AssetHierarchy />
          </Col> */}
        </Row>
      </Container>
    </>
  );
}
