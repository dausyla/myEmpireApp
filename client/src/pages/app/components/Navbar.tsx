import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";
import { useTheme } from "../../../contexts/ThemeContext/ThemeContextHook";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import { useState, type JSX } from "react";
import { NavbarMenu } from "./Navbar/NavbarMenu";
import { NavbarMobileMenu } from "./Navbar/NavbarMobileMenu";

export function NavBar({
  openWindow,
}: {
  openWindow: (
    element: JSX.Element,
    title: string,
    initialWidth: number,
    initialHeight: number,
  ) => void;
}) {
  const { wallet, walletList, getWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!walletList || !wallet) return null;

  const handleWalletClick = (walletId: number) => {
    if (walletId === wallet.wallet.id) return;
    getWallet(walletId);
  };

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm w-full"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          MyEmpireApp
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 btn btn-ghost"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: "var(--text-primary)" }}
        >
          <FaBars />
        </button>

        {/* Desktop Menu */}
        <NavbarMenu
          walletList={walletList}
          currentWalletId={wallet.wallet.id}
          onWalletClick={handleWalletClick}
          openWindow={openWindow}
        />

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <span
            className="font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {wallet.wallet.title}
          </span>
          <button
            onClick={toggleTheme}
            className="p-1 btn btn-ghost hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-primary)" }}
          >
            {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <NavbarMobileMenu isOpen={isMobileMenuOpen} />
    </nav>
  );
}
