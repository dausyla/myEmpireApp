import { Button, NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { usePortfolio } from "../../contexts/PortfolioContext/PortfolioContextHook";
import { EditableText } from "../utilies/EditableText";
import { useAppContext } from "../../contexts/AppContext/AppContextHook";
import { BsTrash } from "react-icons/bs";

export function NavBar({
  setCurrentNav,
}: {
  setCurrentNav: (nav: string) => void;
}) {
  const {
    portfolios,
    setCurrentPortfolioId,
    createNewPortfolioExample,
    createNewPortfolioEmpty,
    deletePortfolio,
  } = useAppContext();
  const { isModified, savePortfolio, portfolio, modifyPortfolio } =
    usePortfolio();

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(portfolio, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.empire";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        modifyPortfolio(parsed);
      } catch (err) {
        console.error("Invalid file format:", err);
      }
    };
    reader.readAsText(file);
    // reset input so same file can be re-imported
    e.target.value = "";
  };

  const portfolioNames = portfolios?.map((p) => p.name);

  return (
    <Navbar sticky="top" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onClick={() => setCurrentNav("predictions")}>
          MyEmpireApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <NavDropdown title="Portfolios" id="basic-nav-dropdown">
            {portfolios ? (
              portfolioNames?.map((name, index) => (
                <NavDropdown.Item
                  key={index}
                  onClick={() => setCurrentPortfolioId(portfolios[index].id)}
                >
                  {name}
                </NavDropdown.Item>
              ))
            ) : (
              <></>
            )}
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => createNewPortfolioEmpty()}>
              + New Empty Portfolio
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => createNewPortfolioExample()}>
              + New Example Portfolio
            </NavDropdown.Item>
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
          {portfolio ? (
            <>
              <EditableText
                value={portfolio.name}
                modifyValue={(newName) => {
                  portfolio.name = newName;
                  modifyPortfolio(portfolio);
                }}
              />
              <Button
                onClick={savePortfolio}
                disabled={!isModified}
                className="ms-2"
              >
                Save
              </Button>{" "}
              <Button
                onClick={() => deletePortfolio(portfolio.id)}
                variant="outline-danger"
                className="ms-2"
              >
                <BsTrash />
              </Button>{" "}
            </>
          ) : (
            <></>
          )}
          <Button
            variant="outline-primary"
            onClick={handleExport}
            className="ms-2"
          >
            Export
          </Button>
          <label htmlFor="import-file">
            <input
              id="import-file"
              type="file"
              accept=".json,.empire,application/json"
              onChange={handleImport}
              style={{ display: "none" }}
            />
            <Button as="span" variant="outline-success">
              Import
            </Button>
          </label>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
