import { useState, useRef, useEffect, createContext, useContext } from "react";

const DropdownContext = createContext<{ close: () => void } | null>(null);

export const NavbarDropdown = ({
  title,
  children,
  className = "",
  align = "left",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
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

  const close = () => setIsOpen(false);

  return (
    <DropdownContext.Provider value={{ close }}>
      <div className={`dropdown ${className}`} ref={dropdownRef}>
        <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
          {title}
          <span className="text-xs opacity-50">▼</span>
        </div>
        {isOpen && (
          <div
            className="dropdown-menu"
            style={align === "right" ? { right: 0, left: "auto" } : {}}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
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
}) => {
  const dropdown = useContext(DropdownContext);

  return (
    <button
      onClick={() => {
        onClick?.();
        dropdown?.close();
      }}
      className={`dropdown-item ${active ? "active" : ""}`}
    >
      {children}
    </button>
  );
};
