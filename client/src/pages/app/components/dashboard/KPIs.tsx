import { Card, Row, Col, Container } from "react-bootstrap";
import { usePortfolio } from "../../../../contexts/WalletContext/WalletContextHook";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";

export function KPIs() {
  const { portfolio } = usePortfolio();
  const { mapAssets } = useAssetContext();
  if (!portfolio) return null;

  let totalValue = 0;
  mapAssets((asset) => {
    totalValue += asset.values[asset.values.length - 1];
  });

  let totalInput = 0;
  mapAssets((asset) => {
    totalInput += asset.inputs.reduce((a, b) => a + b, 0);
  });
  const interests = totalValue - totalInput;
  const apy = (totalInput > 0 ? (interests / totalInput) * 100 : 0).toFixed(2);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card className="text-center border-0">
            <Card.Body className="p-0">
              <Card.Title>Total Value</Card.Title>
              <h4>{totalValue.toFixed(2)} $</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center border-0">
            <Card.Body className="p-0">
              <Card.Title>Total Input</Card.Title>
              <h4>{totalInput.toFixed(2)} $</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center border-0">
            <Card.Body className="p-0">
              <Card.Title>Total Interests</Card.Title>
              <h4 className="text-success">{interests.toFixed(2)} $</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center border-0">
            <Card.Body className="p-0">
              <Card.Title>APY</Card.Title>
              <h4 className="text-primary">{apy} %</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
