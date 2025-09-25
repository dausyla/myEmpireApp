import { Col, Container, Row } from "react-bootstrap";
import { Tabs } from "./predictionsComponents/Tabs";
import { Graphs } from "./predictionsComponents/graphs/Graph";
import { AutomatePredictions } from "./predictionsComponents/automate/AutomatePredictions";

export function Predictions() {
  return (
    <Container fluid className="py-3" style={{ height: "90vh" }}>
      <Row>
        <Col md={4}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              height: "100%",
            }}
          >
            <Tabs />
            <AutomatePredictions />
          </div>
        </Col>
        <Col>
          <Graphs />
        </Col>
      </Row>
    </Container>
  );
}
