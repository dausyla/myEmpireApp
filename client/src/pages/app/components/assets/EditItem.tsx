import { useState, useEffect } from "react";
import { BsPalette, BsPercent, BsFileText } from "react-icons/bs";
import { useApp } from "../../../../contexts/AppContext/AppContextHook";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";

export function EditItem() {
  const { currentItem } = useApp();
  const { updateAsset, updateDir } = useBatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [apy, setApy] = useState<string>("");

  useEffect(() => {
    if (!currentItem) return;

    setName(currentItem.name);
    if (currentItem.type === "asset") {
      setColor(currentItem.color);
      setApy(currentItem.estimated_apy?.toString() ?? "");
      setDescription(""); // Asset has no description
    } else {
      // Directory
      setDescription(currentItem.description || "");
      setColor("#F59E0B"); // Default dir color, not editable
      setApy("");
    }
  }, [currentItem]);

  if (!currentItem) return null;

  const handleSave = () => {
    if (currentItem.type === "asset") {
      updateAsset(currentItem.id, {
        name,
        color,
        estimated_apy: apy === "" ? null : parseFloat(apy),
      });
    } else {
      updateDir(currentItem.id, {
        name,
        description,
      });
    }
  };

  const inputClass =
    "w-full bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded text-[0.8rem] px-2 py-1 min-h-[28px] transition-colors focus:border-[#e94057] focus:ring-2 focus:ring-[#e94057]/10 outline-none";
  const labelClass =
    "flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1";

  return (
    <div className="flex flex-col h-full p-[15px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 m-0">
        {/* Name */}
        <div className="col-span-1 md:col-span-2">
          <div className="mb-2">
            <label className={labelClass}>
              <span className="text-[0.9rem] text-(--text-primary)">📝</span>
              Name
            </label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              placeholder="Enter name"
            />
          </div>
        </div>

        {/* Description (Directory only) */}
        {currentItem.type === "directory" && (
          <div className="col-span-1 md:col-span-2">
            <div className="mb-2">
              <label className={labelClass}>
                <BsFileText className="text-[0.9rem] text-(--text-primary)" />
                Description
              </label>
              <textarea
                className={`${inputClass} min-h-[60px] resize-y`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Enter description"
              />
            </div>
          </div>
        )}

        {/* Asset only fields */}
        {currentItem.type === "asset" && (
          <>
            <div className="col-span-1">
              <div className="mb-2 m-1">
                <label className={labelClass}>
                  <BsPalette className="text-[0.9rem] text-(--text-primary)" />
                  Color Theme
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    className="w-8 h-7 p-0.5 border border-(--border-color) rounded bg-(--bg-surface-secondary) cursor-pointer"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    onBlur={handleSave}
                  />
                  <input
                    className={`${inputClass} font-mono uppercase flex-1`}
                    value={color.toUpperCase()}
                    onChange={(e) => setColor(e.target.value)}
                    onBlur={handleSave}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="mb-2 m-1">
                <label className={labelClass}>
                  <BsPercent className="text-[0.9rem] text-(--text-primary)" />
                  Est. APY
                </label>
                <div className="flex">
                  <input
                    className={`${inputClass} rounded-r-none`}
                    type="number"
                    step="0.01"
                    value={apy}
                    onChange={(e) => setApy(e.target.value)}
                    onBlur={handleSave}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
