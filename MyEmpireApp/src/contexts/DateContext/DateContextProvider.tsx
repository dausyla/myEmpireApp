import type { ReactNode } from "react";
import { usePortfolio } from "../PortfolioContext/PortfolioContextHook";
import { DateContext } from "./DateContextHook";
import { useAssetContext } from "../AssetContext/AssetContextHook";

export const DateContextProvider = ({ children }: { children: ReactNode }) => {
  const { portfolio, modifyPortfolio } = usePortfolio();
  const { mapAssets } = useAssetContext();

  const addDate = (date: number) => {
    if (!portfolio) return;
    if (portfolio.dates.includes(date)) {
      alert("This date already exists!");
      return;
    }

    portfolio.dates.push(date);
    portfolio.dates.sort((a, b) => a - b);
    const index = portfolio.dates.indexOf(date);
    mapAssets((asset) => {
      const previousValue = index > 0 ? asset.values[index - 1] : 0;
      asset.values.splice(index, 0, previousValue);
      asset.inputs.splice(index, 0, 0);
    });

    modifyPortfolio(portfolio);
  };

  const editDate = (oldDate: number, newDate: number) => {
    if (!portfolio) return;
    if (portfolio.dates.includes(newDate)) {
      alert("This date already exists!");
      return;
    }

    const index = portfolio.dates.indexOf(oldDate);
    if (index === -1) return;

    portfolio.dates[index] = newDate;
    portfolio.dates.sort((a, b) => a - b);

    mapAssets((asset) => {
      const value = asset.values.splice(index, 1)[0];
      const input = asset.inputs.splice(index, 1)[0];
      const newIndex = portfolio.dates.indexOf(newDate);
      asset.values.splice(newIndex, 0, value);
      asset.inputs.splice(newIndex, 0, input);
    });

    modifyPortfolio(portfolio);
  };

  const deleteDate = (date: number) => {
    if (!portfolio) return;
    const index = portfolio.dates.indexOf(date);
    if (index === -1) return;

    portfolio.dates.splice(index, 1);
    mapAssets((asset) => {
      asset.values.splice(index, 1);
      asset.inputs.splice(index, 1);
    });

    modifyPortfolio(portfolio);
  };

  return (
    <DateContext.Provider
      value={{
        addDate,
        editDate,
        deleteDate,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
