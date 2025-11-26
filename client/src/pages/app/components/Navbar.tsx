import { NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";
import type { JSX } from "react";
import { AssetPerformence } from "./assets/AssetPerformence";
import { AssetValuesTable } from "./assets/AssetValuesTable";
import { EditAsset } from "./assets/EditAsset";

export function NavBar({
  openWindow,
}: {
  openWindow: (element: JSX.Element, title: string) => void;
}) {
  const { wallet, walletList, getWallet } = useWallet();

  if (!walletList || !wallet) return null;

  const handleWalletClick = (walletId: number) => {
    if (walletId === wallet.wallet.id) return;
    getWallet(walletId);
  };

  return (
    <Navbar sticky="top" expand="lg" className="bg-body-tertiary shadow-sm">
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
          <NavDropdown title="Windows" id="basic-nav-dropdown" className="ms-3">
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
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end" style={{ gap: 8 }}>
          {wallet.wallet.title}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
