import { Container, ListGroup } from "react-bootstrap";
import { usePortfolio } from "../../../contexts/PortfolioContext/PortfolioContextHook";
import type { Directory } from "../../../types/PortfolioTypes";
import { DirectoryItem } from "./DirectoryItem";

export function AssetHierarchy() {
  const { portfolio, modifyPortfolio } = usePortfolio();
  if (!portfolio) return null;

  const toggleDirectory = (dir: Directory) => {
    dir.isOpened = !dir.isOpened;
    modifyPortfolio(portfolio);
  };

  return (
    <Container fluid className="h-100 p-0" style={{ backgroundColor: "red" }}>
      <ListGroup variant="flush" className="rounded-2">
        <DirectoryItem dir={portfolio.root} toggleDirectory={toggleDirectory} />
      </ListGroup>
    </Container>
  );
}
