import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { usePortfolio } from "../../contexts/DataContext/PortfolioContextHook";

export function NavBar({
  setCurrentNav,
}: {
  setCurrentNav: (nav: string) => void;
}) {
  const { isModified, savePortfolio } = usePortfolio();

  return (
    <Navbar sticky="top" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onClick={() => setCurrentNav("predictions")}>
          MyEmpireApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setCurrentNav("predictions")}>
              Home
            </Nav.Link>
            <Nav.Link onClick={() => setCurrentNav("predictions")}>
              Predictions
            </Nav.Link>
            <Nav.Link onClick={() => setCurrentNav("assets")}>Assets</Nav.Link>
            <Button onClick={savePortfolio} disabled={!isModified}>
              Save
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
