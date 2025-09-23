import { Col, Container, Row } from "react-bootstrap";
import { Tabs } from "./predictionsComponents/Tabs";
import { Graphs } from "./predictionsComponents/graphs/Graph";

export function Predictions() {
  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={4}>
          <Tabs />
        </Col>
        <Col>
          <Graphs />
        </Col>
      </Row>
    </Container>
  );
}
