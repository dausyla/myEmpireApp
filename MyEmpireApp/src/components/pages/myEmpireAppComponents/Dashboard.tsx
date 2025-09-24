import { Container, Row, Col, Card } from "react-bootstrap";
import { KPIs } from "./dashboardComponents/KPIs";
import { AssetRepartition } from "./dashboardComponents/AssetRepartition";
import { MonthlyInputs } from "./dashboardComponents/MonthlyInputs";
import { PortfolioGrowth } from "./dashboardComponents/PortfolioGrowth";
import { InterestsRepartition } from "./dashboardComponents/InterestsRepartition";

export function Dashboard() {
  return (
    <Container fluid className="py-3">
      <Row>
        <Col>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <KPIs />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={2}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <AssetRepartition />
            </Card.Body>
          </Card>
        </Col>
        <Col md={10}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <PortfolioGrowth />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={10}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <MonthlyInputs />
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <InterestsRepartition />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
