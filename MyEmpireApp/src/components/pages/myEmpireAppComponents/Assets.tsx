import { Card, Col, Container, Row } from "react-bootstrap";
import { EditAsset } from "./assetsComponenents/EditAsset";
import { AssetValuesTable } from "./assetsComponenents/AssetValuesTable";
import { AssetPerformence } from "./assetsComponenents/AssetPerformence";
import { AssetPredictions } from "./assetsComponenents/AssetPredictions";
import { usePortfolio } from "../../../contexts/PortfolioContext/PortfolioContextHook";
import { NoAssetComponent } from "./assetsComponenents/NoAssetComponent";

export function Assets() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;
  if (portfolio.assetNumber === 0) return <NoAssetComponent />;

  return (
    <Container fluid className="h-100 p-2">
      <Row className="m-0">
        <Col md={6}>
          <Card className="rounded shadow-sm p-2">
            <AssetValuesTable />
          </Card>
        </Col>
        <Col>
          <Container fluid>
            <Row>
              <Col>
                <EditAsset />
              </Col>
            </Row>
            <Row>
              <Col>
                <Card className="rounded shadow-sm p-2 mb-3">
                  <AssetPerformence />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card className="rounded shadow-sm p-2">
                  <AssetPredictions />
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
