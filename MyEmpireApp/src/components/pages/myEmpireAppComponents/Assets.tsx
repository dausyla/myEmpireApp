import { Col, Row } from "react-bootstrap";
import { AssetDropdown } from "./assetsComponenents/AssetsDropdown";
import { EditAsset } from "./assetsComponenents/EditAsset";
import { AssetValuesTable } from "./assetsComponenents/AssetValuesTable";
import { AssetPerformence } from "./assetsComponenents/AssetPerformence";
import { AssetPredictions } from "./assetsComponenents/AssetPredictions";
import { usePortfolio } from "../../../contexts/PortfolioContext/PortfolioContextHook";
import { NoAssetComponent } from "./assetsComponenents/NoAssetComponent";
export function Assets() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;
  if (portfolio.assets.length === 0) return <NoAssetComponent />;

  return (
    <>
      <Row>
        <Col md={2}>
          <AssetDropdown />
        </Col>
        <Col>
          <EditAsset />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <AssetValuesTable />
        </Col>
        <Col>
          <Row>
            <Col>
              <AssetPerformence />
            </Col>
          </Row>
          <Row>
            <Col>
              <AssetPredictions />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
