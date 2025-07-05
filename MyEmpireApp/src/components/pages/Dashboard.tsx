import { Col, Container, Row } from "react-bootstrap";
import { NavBar } from "../navbar/Navbar";
import { Tabs } from "./dashboardComponents/Tabs";
import { Graphs } from "./dashboardComponents/graphs/Graph";

export function Dashboard() {
  return (
    // Container taking the full width and height of the viewport
    // with no padding
    <Container fluid className="p-0 vh-100">
      {/* Ensure the NavBar is fixed at the top */}
      <Row>
        <Col>
          <NavBar />
        </Col>
      </Row>
      {/* Main content starts below the NavBar */}
      <Row className="mt-5 pt-3">
        <Col>
          <Tabs />
        </Col>
        <Col md={8}>
          <Graphs />
        </Col>
      </Row>
    </Container>
  );
}
