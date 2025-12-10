import { useState, useEffect } from "react";
import { BsPalette, BsPercent } from "react-icons/bs";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
export function EditAsset() {
  const { currentItem } = useApp();
  const { updateAsset } = useBatch();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [apy, setApy] = useState<string>("");

  useEffect(() => {
    if (!currentItem || "wallet_id" in currentItem) return;

    setName(currentItem.name);
    setColor(currentItem.color);
    setApy(currentItem.estimated_apy?.toString() ?? "");
  }, [currentItem]);

  if (!currentItem || "wallet_id" in currentItem) return null;

  const handleSaveAsset = () => {
    updateAsset(currentItem.id, {
      name,
      color,
      estimated_apy: apy === "" ? null : parseFloat(apy),
    });
  };

  const inputClass =
    "w-full bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded text-[0.8rem] px-2 py-1 min-h-[28px] transition-colors focus:border-[#e94057] focus:ring-2 focus:ring-[#e94057]/10 outline-none";
  const labelClass =
    "flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1";

  return (
    <div className="flex flex-col h-full p-[15px]">
      {/* Header removed as it is now part of the Window component */}

      {/* Asset Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 m-0">
        {/* Asset Name */}
        <div className="col-span-1 md:col-span-2">
          <div className="mb-2">
            <label className={labelClass}>
              <span className="text-[0.9rem] text-[var(--text-primary)]">
                📝
              </span>
              Asset Name
            </label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveAsset}
              placeholder="Enter asset name"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="col-span-1">
          <div className="mb-2 m-1">
            <label className={labelClass}>
              <BsPalette className="text-[0.9rem] text-[var(--text-primary)]" />
              Color Theme
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                className="w-8 h-7 p-0.5 border border-[var(--border-color)] rounded bg-[var(--bg-surface-secondary)] cursor-pointer"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                onBlur={handleSaveAsset}
              />
              <input
                className={`${inputClass} font-mono uppercase flex-1`}
                value={color.toUpperCase()}
                onChange={(e) => setColor(e.target.value)}
                onBlur={handleSaveAsset}
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* APY */}
        <div className="col-span-1">
          <div className="mb-2 m-1">
            <label className={labelClass}>
              <BsPercent className="text-[0.9rem] text-[var(--text-primary)]" />
              Est. APY
            </label>
            <div className="flex">
              <input
                className={`${inputClass} rounded-r-none`}
                type="number"
                step="0.01"
                value={apy}
                onChange={(e) => setApy(e.target.value)}
                onBlur={handleSaveAsset}
                placeholder="0.00"
              />
              {/* Removed InputGroup.Text as per previous user edit, but if needed it would be here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
