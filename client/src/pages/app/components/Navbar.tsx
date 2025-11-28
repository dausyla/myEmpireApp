import { NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";
import { useTheme } from "../../../contexts/ThemeContext/ThemeContextHook";
import { FaSun, FaMoon } from "react-icons/fa";
import { Button } from "react-bootstrap";
import type { JSX } from "react";
import { AssetPerformence } from "./assets/AssetPerformence";
import { AssetValuesTable } from "./assets/AssetValuesTable";
import { EditAsset } from "./assets/EditAsset";
import { EditTransactions } from "./transactions/EditTransactions";
import { EditRecurringTransactions } from "./transactions/EditRecurringTransactions";

export function NavBar({
  openWindow,
}: {
  openWindow: (element: JSX.Element, title: string) => void;
}) {
  const { wallet, walletList, getWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();

  if (!walletList || !wallet) return null;

  const handleWalletClick = (walletId: number) => {
    if (walletId === wallet.wallet.id) return;
    getWallet(walletId);
  };

  return (
    <Navbar
      sticky="top"
      expand="lg"
      className="shadow-sm"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <Container>
        <Navbar.Brand>MyEmpireApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <NavDropdown title="Wallets" id="basic-nav-dropdown">
            {walletList.map((w, i) => (
              <NavDropdown.Item
                key={i}
                onClick={() => handleWalletClick(walletList[i].id)}
              >
                {w.title}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <NavDropdown title="Assets" id="basic-nav-dropdown" className="ms-3">
            <NavDropdown.Item
              onClick={() =>
                openWindow(<AssetPerformence />, "Asset Performance")
              }
            >
              Asset Performance
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => openWindow(<AssetValuesTable />, "Asset Values")}
            >
              Asset Values
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => openWindow(<EditAsset />, "Edit Asset")}
            >
              Edit Asset
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Transactions"
            id="basic-nav-dropdown"
            className="ms-3"
          >
            <NavDropdown.Item
              onClick={() =>
                openWindow(<EditTransactions />, "Edit Transactions")
              }
            >
              Edit Transactions
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() =>
                openWindow(
                  <EditRecurringTransactions />,
                  "Edit Recurring Transactions",
                )
              }
            >
              Edit Recurring Transactions
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end" style={{ gap: 16 }}>
          <span className="fw-medium">{wallet.wallet.title}</span>
          <Button
            variant="link"
            onClick={toggleTheme}
            className="p-0 text-decoration-none"
            style={{ color: "var(--text-primary)" }}
          >
            {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
