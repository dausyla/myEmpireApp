import { Col, Row } from "react-bootstrap";
import { Tabs } from "./predictionsComponents/Tabs";
import { Graphs } from "./predictionsComponents/graphs/Graph";

export function Predictions() {
  return (
    <Row>
      <Col md={4}>
        <Tabs />
      </Col>
      <Col>
        <Graphs />
      </Col>
    </Row>
  );
}
