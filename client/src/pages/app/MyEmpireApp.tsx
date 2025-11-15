import { Col, Container, Row } from "react-bootstrap";
import { Assets } from "./components/assets/Assets";
import { useWallet } from "../../contexts/WalletContext/WalletContextHook";
import { SelectWallet } from "./components/SelectWallet";

export function MyEmpireApp() {
  const { wallet } = useWallet();
  // const [currentNav, setCurrentNav] = useState("dashboard");

  return (
    <>
      {/* <NavBar setCurrentNav={setCurrentNav} /> */}

      <Container fluid className="p-0" style={{ height: "90vh" }}>
        <Row className="h-100 m-0">
          {/* <Col md={2} className="h-100 p-0">
            <AssetHierarchy />
          </Col> */}
          <Col className="h-100 p-0">
            {wallet ? <Assets /> : <SelectWallet />}
            {/* {currentNav === "dashboard" && <Dashboard />} */}
            {/* {currentNav === "predictions" && <Predictions />} */}
            {/* {currentNav === "assets" && <Assets />} */}
          </Col>
        </Row>
      </Container>
    </>
  );
}
