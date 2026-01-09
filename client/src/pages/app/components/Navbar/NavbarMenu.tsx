import type { JSX } from "react";
import { NavbarDropdown, NavbarDropdownItem } from "./NavbarDropdown";
import { ItemPerformance } from "../assets/ItemPerformance";
import { ItemValues } from "../assets/ItemValues";
import { EditItem } from "../assets/EditItem";
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
            openWindow(<ItemPerformance />, "Item Performance", 350, 230)
          }
        >
          Performance
        </NavbarDropdownItem>
        <NavbarDropdownItem
          onClick={() => openWindow(<ItemValues />, "Values", 800, 530)}
        >
          Values Table
        </NavbarDropdownItem>
        <NavbarDropdownItem
          onClick={() => openWindow(<EditItem />, "Edit Item", 320, 200)}
        >
          Edit Item
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
              "Item Value Prediction",
              700,
              500,
            )
          }
        >
          Item Value Prediction
        </NavbarDropdownItem>
      </NavbarDropdown>
    </div>
  );
};
