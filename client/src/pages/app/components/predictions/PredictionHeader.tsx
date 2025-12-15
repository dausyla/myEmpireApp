interface PredictionHeaderProps {
  years: number;
  setYears: (years: number) => void;
  isDetailed: boolean;
  setIsDetailed: (isDetailed: boolean) => void;
}

export function PredictionHeader({
  years,
  setYears,
  isDetailed,
  setIsDetailed,
}: PredictionHeaderProps) {
  return (
    <div
      className="flex items-center gap-4 text-sm"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <label className="text-[var(--text-primary)]">Years:</label>
        <input
          type="number"
          min="0"
          max="99"
          value={years}
          onChange={(e) =>
            setYears(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))
          }
          className="input w-16 py-1 px-2 h-8 text-center"
        />
      </div>
      <div className="flex items-center gap-2 border-l border-[var(--border-color)] pl-4">
        <label className="text-[var(--text-primary)]">Detail:</label>
        <button
          onClick={() => setIsDetailed(!isDetailed)}
          className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-[#e94077] ${
            isDetailed
              ? "bg-[#e94077]"
              : "bg-gray-300 border border-[var(--border-color)]"
          }`}
        >
          <span
            className={`${
              isDetailed ? "translate-x-4" : "translate-x-1"
            } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
          />
        </button>
      </div>
    </div>
  );
}
