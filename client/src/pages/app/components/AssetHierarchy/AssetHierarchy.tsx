import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { DirectoryItem } from "./DirectoryItem";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import "./AssetHierarchy.css";

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
    <div className="hierarchy-container">
      <div className="hierarchy-header">
        <Row className="g-2">
          <Col xs={6}>
            <Button
              variant="link"
              className="hierarchy-btn w-100 justify-content-center"
              // onClick={() => addNewAsset({})}
            >
              <FaFileAlt /> New Asset
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant="link"
              className="hierarchy-btn w-100 justify-content-center"
              // onClick={() => addNewDir({})}
            >
              <FaFolder /> New Dir
            </Button>
          </Col>
        </Row>
      </div>
      <div className="hierarchy-scroll-area">
        <ListGroup variant="flush" className="p-0">
          <DirectoryItem dir={root} />
        </ListGroup>
      </div>
    </div>
  );
}
