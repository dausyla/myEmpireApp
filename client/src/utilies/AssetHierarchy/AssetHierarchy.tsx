import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { usePortfolio } from "../../contexts/WalletContext/WalletContextHook";
import { DirectoryItem } from "./DirectoryItem";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { useAssetContext } from "../../contexts/AssetContext/AssetContextHook";

export function AssetHierarchy() {
  const { portfolio } = usePortfolio();
  const { addNewAsset, addNewDir } = useAssetContext();
  if (!portfolio) return null;

  return (
    <Container fluid className="h-100 p-1 bg-body-tertiary">
      <Row className="p-1">
        <Col className="p-0">
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => addNewAsset({})}
          >
            New Asset&nbsp;
            <FaFileAlt />
          </Button>
        </Col>
        <Col className="p-0">
          <Button
            size="sm"
            variant="outline-success"
            onClick={() => addNewDir({})}
          >
            New Dir&nbsp;
            <FaFolder />
          </Button>
        </Col>
      </Row>
      <ListGroup variant="flush" className="">
        <DirectoryItem dir={portfolio.root} />
      </ListGroup>
    </Container>
  );
}
