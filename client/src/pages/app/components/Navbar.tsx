import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";
import { useTheme } from "../../../contexts/ThemeContext/ThemeContextHook";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import { useState, useRef, useEffect, type JSX } from "react";
import { AssetPerformence } from "./assets/AssetPerformence";
import { AssetValuesTable } from "./assets/AssetValuesTable";
import { EditAsset } from "./assets/EditAsset";
import { EditTransactions } from "./transactions/EditTransactions";
import { EditRecurringTransactions } from "./transactions/EditRecurringTransactions";

const Dropdown = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[var(--text-primary)] hover:text-[var(--brand-primary)] font-medium flex items-center gap-1 transition-colors"
      >
        {title}
        <span className="text-xs opacity-50">▼</span>
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-48 border border-[var(--border-color)] rounded shadow-lg z-50 py-1"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={(e) => {
      onClick?.();
      // Optional: close dropdown here if we had access to setIsOpen
    }}
    className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-surface-secondary)] transition-colors"
    style={{ color: "var(--text-primary)" }}
  >
    {children}
  </button>
);

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
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: "var(--text-primary)" }}
        >
          <FaBars />
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <Dropdown title="Wallets">
            {walletList.map((w, i) => (
              <DropdownItem
                key={i}
                onClick={() => handleWalletClick(walletList[i].id)}
              >
                {w.title}
              </DropdownItem>
            ))}
          </Dropdown>

          <Dropdown title="Assets">
            <DropdownItem
              onClick={() =>
                openWindow(<AssetPerformence />, "Asset Performance", 350, 230)
              }
            >
              Asset Performance
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                openWindow(<AssetValuesTable />, "Asset Values", 800, 530)
              }
            >
              Asset Values
            </DropdownItem>
            <DropdownItem
              onClick={() => openWindow(<EditAsset />, "Edit Asset", 320, 200)}
            >
              Edit Asset
            </DropdownItem>
          </Dropdown>

          <Dropdown title="Transactions">
            <DropdownItem
              onClick={() =>
                openWindow(<EditTransactions />, "Edit Transactions", 1000, 500)
              }
            >
              Edit Transactions
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                openWindow(
                  <EditRecurringTransactions />,
                  "Edit Recurring Transactions",
                  1000,
                  500,
                )
              }
            >
              Edit Recurring Transactions
            </DropdownItem>
          </Dropdown>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-4">
          <span
            className="font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {wallet.wallet.title}
          </span>
          <button
            onClick={toggleTheme}
            className="p-1 hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-primary)" }}
          >
            {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Simple implementation) */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden border-t p-4 flex flex-col gap-4"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Mobile menu items would go here, simplified for now */}
          <div className="font-medium">Wallets</div>
          <div className="font-medium">Assets</div>
          <div className="font-medium">Transactions</div>
        </div>
      )}
    </nav>
  );
}
