import type { JSX } from "react";
import { NavbarDropdown, NavbarDropdownItem } from "./NavbarDropdown";
import { ItemPerformance } from "../assets/ItemPerformance";
import { ItemValues } from "../assets/ItemValues";
import { EditItem } from "../assets/EditItem";
import { EditTransactions } from "../transactions/EditTransactions";
import { EditRecurringTransactions } from "../transactions/EditRecurringTransactions";
import { AssetValuePrediction } from "../predictions/AssetValuePrediction";
import type { WindowLayoutItem } from "../Windows/WindowManager/WindowManager";

interface NavbarMenuProps {
  openWindow: (
    element: JSX.Element,
    title: string,
    initialWidth: number,
    initialHeight: number,
    headerActions?: React.ReactNode,
    componentKey?: string,
    x?: number,
    y?: number,
  ) => void;
  getLayout: () => WindowLayoutItem[];
  closeAll: () => void;
}

const WINDOW_REGISTRY: Record<
  string,
  {
    component: JSX.Element;
    title: string;
    defaultWidth: number;
    defaultHeight: number;
  }
> = {
  "item-performance": {
    component: <ItemPerformance />,
    title: "Item Performance",
    defaultWidth: 350,
    defaultHeight: 230,
  },
  "item-values": {
    component: <ItemValues />,
    title: "Values",
    defaultWidth: 800,
    defaultHeight: 530,
  },
  "edit-item": {
    component: <EditItem />,
    title: "Edit Item",
    defaultWidth: 320,
    defaultHeight: 200,
  },
  "edit-transactions": {
    component: <EditTransactions />,
    title: "Edit Transactions",
    defaultWidth: 1000,
    defaultHeight: 500,
  },
  "edit-recurring-transactions": {
    component: <EditRecurringTransactions />,
    title: "Edit Recurring Transactions",
    defaultWidth: 1000,
    defaultHeight: 500,
  },
  "asset-value-prediction": {
    component: <AssetValuePrediction />,
    title: "Item Value Prediction",
    defaultWidth: 700,
    defaultHeight: 500,
  },
};

const PRESETS: Record<string, WindowLayoutItem[]> = {
  "Data Maxing": [
    {
      componentKey: "edit-transactions",
      title: "Edit Transactions",
      x: 614,
      y: 1,
      width: 825,
      height: 288,
    },
    {
      componentKey: "edit-item",
      title: "Edit Item",
      x: 241,
      y: 1,
      width: 373,
      height: 288,
    },
    {
      componentKey: "item-values",
      title: "Values",
      x: 241,
      y: 289,
      width: 373,
      height: 337.296875,
    },
    {
      componentKey: "edit-recurring-transactions",
      title: "Edit Recurring Transactions",
      x: 614,
      y: 289,
      width: 825,
      height: 337.296875,
    },
  ],
  "Prediction maxing": [
    {
      componentKey: "asset-value-prediction",
      title: "Item Value Prediction",
      x: 642,
      y: 1,
      width: 797,
      height: 315,
    },
    {
      componentKey: "item-performance",
      title: "Item Performance",
      x: 241,
      y: 316,
      width: 401,
      height: 310.296875,
    },
    {
      componentKey: "edit-item",
      title: "Edit Item",
      x: 241,
      y: 1,
      width: 401,
      height: 315,
    },
    {
      componentKey: "edit-recurring-transactions",
      title: "Edit Recurring Transactions",
      x: 642,
      y: 316,
      width: 797,
      height: 310.296875,
    },
  ],
  "Value Maxing": [
    {
      componentKey: "edit-item",
      title: "Edit Item",
      x: 241,
      y: 1,
      width: 493,
      height: 218,
    },
    {
      componentKey: "asset-value-prediction",
      title: "Item Value Prediction",
      x: 241,
      y: 219,
      width: 493,
      height: 407.296875,
    },
    {
      componentKey: "item-values",
      title: "Values",
      x: 734,
      y: 1,
      width: 705,
      height: 625.296875,
    },
  ],
};

export const NavbarMenu = ({
  openWindow,
  getLayout,
  closeAll,
}: NavbarMenuProps) => {
  const handleLogLayout = () => {
    const layout = getLayout();
    console.log("Current Layout JSON:", JSON.stringify(layout, null, 2));
    alert("Layout JSON logged to console!");
  };

  const restoreLayout = (layout: WindowLayoutItem[]) => {
    closeAll();
    // Small timeout to allow cleanup if needed, but synchronous should be fine
    // React state updates might batch, so let's just fire openWindow calls
    setTimeout(() => {
      layout.forEach((item) => {
        const registryItem = WINDOW_REGISTRY[item.componentKey];
        if (registryItem) {
          openWindow(
            registryItem.component,
            registryItem.title,
            item.width,
            item.height,
            undefined,
            item.componentKey,
            item.x,
            item.y,
          );
        }
      });
    }, 10);
  };

  return (
    <div className="hidden md:flex items-center gap-2">
      <NavbarDropdown title="Assets">
        <NavbarDropdownItem
          onClick={() =>
            openWindow(
              <ItemPerformance />,
              "Item Performance",
              350,
              230,
              undefined,
              "item-performance",
            )
          }
        >
          Performance
        </NavbarDropdownItem>
        <NavbarDropdownItem
          onClick={() =>
            openWindow(
              <ItemValues />,
              "Values",
              800,
              530,
              undefined,
              "item-values",
            )
          }
        >
          Values Table
        </NavbarDropdownItem>
        <NavbarDropdownItem
          onClick={() =>
            openWindow(
              <EditItem />,
              "Edit Item",
              320,
              200,
              undefined,
              "edit-item",
            )
          }
        >
          Edit Item
        </NavbarDropdownItem>
      </NavbarDropdown>

      <NavbarDropdown title="Transactions">
        <NavbarDropdownItem
          onClick={() =>
            openWindow(
              <EditTransactions />,
              "Edit Transactions",
              1000,
              500,
              undefined,
              "edit-transactions",
            )
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
              undefined,
              "edit-recurring-transactions",
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
              undefined,
              "asset-value-prediction",
            )
          }
        >
          Item Value Prediction
        </NavbarDropdownItem>
      </NavbarDropdown>

      <NavbarDropdown title="Layouts">
        {/* <NavbarDropdownItem onClick={handleLogLayout}>
          Log Layout
        </NavbarDropdownItem> To log a layout in the console
        <div className="h-px bg-gray-200 my-1" /> */}
        {Object.entries(PRESETS).map(([name, layout]) => (
          <NavbarDropdownItem key={name} onClick={() => restoreLayout(layout)}>
            {name}
          </NavbarDropdownItem>
        ))}
      </NavbarDropdown>
    </div>
  );
};
