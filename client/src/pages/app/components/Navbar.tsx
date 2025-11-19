import { NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";

export function NavBar({
  setCurrentNav,
}: {
  setCurrentNav: (nav: string) => void;
}) {
  const { wallet, walletList } = useWallet();

  if (!walletList || !wallet) return null;

  return (
    <Navbar sticky="top" expand="lg" className="bg-body-tertiary shadow-sm">
      <Container>
        <Navbar.Brand onClick={() => setCurrentNav("predictions")}>
          MyEmpireApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <NavDropdown title="Wallets" id="basic-nav-dropdown">
            {walletList.map((w, i) => (
              <NavDropdown.Item
                key={i}
                // TODO
                // onClick={() => setCurrentPortfolioId(portfolios[index].id)}
              >
                {w.title}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <Nav className="me-auto align-items-center">
            <Nav.Link onClick={() => setCurrentNav("dashboard")}>
              Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => setCurrentNav("predictions")}>
              Predictions
            </Nav.Link>
            <Nav.Link onClick={() => setCurrentNav("assets")}>Assets</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end" style={{ gap: 8 }}>
          {wallet.wallet.title}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
