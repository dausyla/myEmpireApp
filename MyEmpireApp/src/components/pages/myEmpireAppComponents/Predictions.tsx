import { Col, Container, Row } from "react-bootstrap";
import { Graphs } from "./predictionsComponents/graphs/Graph";

export function Predictions() {
  return (
    <Container fluid className="h-100 p-2">
      <Graphs />
    </Container>
  );
}
