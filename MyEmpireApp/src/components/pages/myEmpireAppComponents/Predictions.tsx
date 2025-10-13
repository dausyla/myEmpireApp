import { Col, Container, Row } from "react-bootstrap";
import { Graphs } from "./predictionsComponents/graphs/Graph";
import { AutomatePredictions } from "./predictionsComponents/automate/AutomatePredictions";

export function Predictions() {
  return (
    <Container fluid className="h-100 p-2">
      <Row className="m-0">
        <Col md={4}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              height: "100%",
            }}
          >
            {/* <Tabs /> */}
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
