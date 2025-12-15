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
        <label className="text-white/80">Years:</label>
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
      <div className="flex items-center gap-2 border-l border-white/20 pl-4">
        <label className="text-white/80">Detail:</label>
        <div className="flex bg-[var(--bg-surface)] rounded-md overflow-hidden border border-[var(--border-color)]">
          <button
            className={`px-3 py-1 text-xs transition-colors ${
              !isDetailed
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-secondary)]"
            }`}
            onClick={() => setIsDetailed(false)}
          >
            Off
          </button>
          <button
            className={`px-3 py-1 text-xs transition-colors ${
              isDetailed
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-secondary)]"
            }`}
            onClick={() => setIsDetailed(true)}
          >
            On
          </button>
        </div>
      </div>
    </div>
  );
}
