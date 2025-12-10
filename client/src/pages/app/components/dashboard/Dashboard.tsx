import { KPIs } from "./KPIs";
import { AssetRepartition } from "./AssetRepartition";
import { PortfolioGrowth } from "./PortfolioGrowth";
import { InterestsRepartition } from "./InterestsRepartition";

export function Dashboard() {
  return (
    <div className="h-full p-2 w-full">
      <div className="flex flex-col md:flex-row h-full m-0 gap-3">
        <div className="w-full md:w-2/3 h-full">
          <div className="flex flex-col h-full gap-3">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-sm">
              <div className="p-4">
                <KPIs />
              </div>
            </div>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-sm flex-1">
              <div className="p-4 h-full">
                <PortfolioGrowth />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 h-full">
          <div className="flex flex-col h-full gap-3">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-sm flex-1">
              <div className="p-4 h-full">
                <AssetRepartition />
              </div>
            </div>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-sm flex-1">
              <div className="p-4 h-full">
                <InterestsRepartition />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
