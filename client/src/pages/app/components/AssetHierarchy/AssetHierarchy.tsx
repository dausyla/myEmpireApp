import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { DirectoryItem } from "./DirectoryItem";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";

export function AssetHierarchy() {
  const { wallet } = useWallet();
  const {} = useBatch();

  if (!wallet) return null;

  const root = wallet.dirs.find((d) => !d.parent_dir_id);

  if (!root) {
    console.log("No root dir...");
    return null;
  }

  return (
    <Container
      fluid
      className="h-100 p-1"
      style={{
        backgroundColor: "var(--bg-surface-secondary)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <Row className="p-1">
        <Col className="p-0">
          <Button
            size="sm"
            variant="link"
            className="text-decoration-none fw-medium"
            style={{ color: "var(--text-primary)" }}
            // onClick={() => addNewAsset({})}
          >
            New Asset&nbsp;
            <FaFileAlt />
          </Button>
        </Col>
        <Col className="p-0">
          <Button
            size="sm"
            variant="link"
            className="text-decoration-none fw-medium"
            style={{ color: "var(--text-primary)" }}
            // onClick={() => addNewDir({})}
          >
            New Dir&nbsp;
            <FaFolder />
          </Button>
        </Col>
      </Row>
      <ListGroup variant="flush" className="">
        <DirectoryItem dir={root} />
      </ListGroup>
    </Container>
  );
}
