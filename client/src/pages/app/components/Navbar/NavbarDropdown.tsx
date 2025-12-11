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
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-trigger">
        {title}
        <span className="text-xs opacity-50">▼</span>
      </button>
      {isOpen && <div className="dropdown-menu">{children}</div>}
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
    className={`dropdown-item ${active ? "active" : ""}`}
  >
    {children}
  </button>
);
