import type { JSX } from "react";
import { NavbarDropdown, NavbarDropdownItem } from "./NavbarDropdown";
import { AssetPerformence } from "../assets/AssetPerformence";
import { AssetValuesTable } from "../assets/AssetValuesTable";
import { EditAsset } from "../assets/EditAsset";
import { EditTransactions } from "../transactions/EditTransactions";
import { EditRecurringTransactions } from "../transactions/EditRecurringTransactions";

interface NavbarMenuProps {
  walletList: { id: number; title: string }[] | null;
  currentWalletId?: number;
  onWalletClick: (id: number) => void;
  openWindow: (
    element: JSX.Element,
    title: string,
    initialWidth: number,
    initialHeight: number,
  ) => void;
}

export const NavbarMenu = ({
  walletList,
  currentWalletId,
  onWalletClick,
  openWindow,
}: NavbarMenuProps) => {
  return (
    <div className="hidden md:flex items-center gap-2">
      <NavbarDropdown title="Wallets">
        {walletList?.map((w) => (
          <NavbarDropdownItem
            key={w.id}
            onClick={() => onWalletClick(w.id)}
            active={w.id === currentWalletId}
          >
            {w.title}
          </NavbarDropdownItem>
        ))}
      </NavbarDropdown>

      <NavbarDropdown title="Assets">
        <NavbarDropdownItem
          onClick={() =>
            openWindow(<AssetPerformence />, "Asset Performance", 350, 230)
          }
        >
          Performance
        </NavbarDropdownItem>
        <NavbarDropdownItem
          onClick={() =>
            openWindow(<AssetValuesTable />, "Asset Values", 800, 530)
          }
        >
          Values Table
        </NavbarDropdownItem>
        <NavbarDropdownItem
          onClick={() => openWindow(<EditAsset />, "Edit Asset", 320, 200)}
        >
          Edit Asset
        </NavbarDropdownItem>
      </NavbarDropdown>

      <NavbarDropdown title="Transactions">
        <NavbarDropdownItem
          onClick={() =>
            openWindow(<EditTransactions />, "Edit Transactions", 1000, 500)
          }
        >
          Edit Transactions
        </NavbarDropdownItem>
        <NavbarDropdownItem
          onClick={() =>
            openWindow(
              <EditRecurringTransactions />,
              "Edit Recurring Transactions",
              1000,
              500,
            )
          }
        >
          Recurring Transactions
        </NavbarDropdownItem>
      </NavbarDropdown>
    </div>
  );
};
