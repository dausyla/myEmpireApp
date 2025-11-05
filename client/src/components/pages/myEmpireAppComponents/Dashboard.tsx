import { Container, Row, Col, Card } from "react-bootstrap";
import { KPIs } from "./dashboardComponents/KPIs";
import { AssetRepartition } from "./dashboardComponents/AssetRepartition";
import { PortfolioGrowth } from "./dashboardComponents/PortfolioGrowth";
import { InterestsRepartition } from "./dashboardComponents/InterestsRepartition";

export function Dashboard() {
  return (
    <Container fluid className="h-100 p-2">
      <Row className="h-100 m-0">
        <Col md={8}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              height: "100%",
            }}
          >
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <KPIs />
              </Card.Body>
            </Card>
            <Card className="shadow-sm mb-3" style={{ flex: 1 }}>
              <Card.Body>
                <PortfolioGrowth />
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col md={4}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              height: "100%",
            }}
          >
            <Card className="shadow-sm mb-3" style={{ flex: 1 }}>
              <Card.Body>
                <AssetRepartition />
              </Card.Body>
            </Card>
            <Card className="shadow-sm mb-3" style={{ flex: 1 }}>
              <Card.Body>
                <InterestsRepartition />
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
