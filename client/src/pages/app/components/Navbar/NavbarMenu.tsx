import type { JSX } from "react";
import { NavbarDropdown, NavbarDropdownItem } from "./NavbarDropdown";
import { AssetPerformence } from "../assets/AssetPerformence";
import { AssetValuesTable } from "../assets/AssetValuesTable";
import { EditAsset } from "../assets/EditAsset";
import { EditTransactions } from "../transactions/EditTransactions";
import { EditRecurringTransactions } from "../transactions/EditRecurringTransactions";
import { AssetValuePrediction } from "../predictions/AssetValuePrediction";

interface NavbarMenuProps {
  openWindow: (
    element: JSX.Element,
    title: string,
    initialWidth: number,
    initialHeight: number,
  ) => void;
}

export const NavbarMenu = ({ openWindow }: NavbarMenuProps) => {
  return (
    <div className="hidden md:flex items-center gap-2">
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

      <NavbarDropdown title="Predictions">
        <NavbarDropdownItem
          onClick={() =>
            openWindow(
              <AssetValuePrediction />,
              "Asset Value Prediction",
              700,
              500,
            )
          }
        >
          Asset Value Prediction
        </NavbarDropdownItem>
      </NavbarDropdown>
    </div>
  );
};
