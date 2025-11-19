import { Card, Col, Container, Row } from "react-bootstrap";
import { EditAsset } from "./EditAsset";
import { AssetValuesTable } from "./AssetValuesTable";
import { AssetPerformence } from "./AssetPerformence";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { NoAssetComponent } from "./NoAssetComponent";

export function Assets() {
  const { currentItem } = useApp();
  const { wallet } = useWallet();
  if (!wallet) return null;
  if (wallet.assets.length === 0) return <NoAssetComponent />;

  if (!currentItem) return null;

  return (
    <Container fluid className="h-100 p-2">
      <Row className="m-0">
        <Col md={6}>
          <Card className="rounded shadow-sm p-2">
            {currentItem.type === "asset" ? <AssetValuesTable /> : null}
          </Card>
        </Col>
        <Col>
          <Container fluid>
            <Row>
              <Col>
                <Card className="rounded shadow-sm p-2 mb-3">
                  {currentItem.type === "asset" ? <AssetPerformence /> : null}
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>{currentItem.type === "asset" ? <EditAsset /> : null}</Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
