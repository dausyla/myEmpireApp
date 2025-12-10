export const NavbarMobileMenu = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return null;
  return (
    <div
      className="md:hidden border-t p-4 flex flex-col gap-4"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Mobile menu items would go here, simplified for now */}
      <div className="font-medium">Wallets</div>
      <div className="font-medium">Assets</div>
      <div className="font-medium">Transactions</div>
    </div>
  );
};
