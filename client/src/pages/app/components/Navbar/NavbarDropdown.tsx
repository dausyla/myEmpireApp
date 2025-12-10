import { useState, useRef, useEffect } from "react";

export const NavbarDropdown = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[var(--text-primary)] hover:text-[var(--brand-primary)] font-medium flex items-center gap-1 transition-colors"
      >
        {title}
        <span className="text-xs opacity-50">▼</span>
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-48 border border-[var(--border-color)] rounded shadow-lg z-50 py-1"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const NavbarDropdownItem = ({
  onClick,
  children,
  active,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <button
    onClick={() => {
      onClick?.();
    }}
    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
      active
        ? "bg-[var(--brand-primary)] text-white"
        : "hover:bg-[var(--bg-surface-secondary)]"
    }`}
    style={active ? {} : { color: "var(--text-primary)" }}
  >
    {children}
  </button>
);
