import { Col, Row } from "react-bootstrap";
import { AssetDropdown } from "./assetsComponenents/AssetsDropdown";
import { EditAsset } from "./assetsComponenents/EditAsset";
export function Assets() {
  return (
    <Row>
      <Col md={2}>
        <AssetDropdown />
      </Col>
      <Col>
        <EditAsset />
      </Col>
    </Row>
  );
}
