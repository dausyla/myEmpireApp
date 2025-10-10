import { ListGroup } from "react-bootstrap";
import { usePortfolio } from "../../contexts/PortfolioContext/PortfolioContextHook";
import type { ReactNode } from "react";

export function AssetHierarchy() {
  const { portfolio } = usePortfolio();
  if (!portfolio) return null;
  const list: ReactNode[] = [];

  return <ListGroup>{list}</ListGroup>;
}
