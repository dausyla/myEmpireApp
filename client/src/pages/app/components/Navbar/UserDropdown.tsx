import { useAuthContext } from "../../../../contexts/AuthContext/AuthContextHook";
import { NavbarDropdown, NavbarDropdownItem } from "./NavbarDropdown";
import { FaUserCircle, FaSignOutAlt, FaCog, FaUserEdit } from "react-icons/fa";
import toast from "react-hot-toast";

export const UserDropdown = () => {
  const { user, logout } = useAuthContext();

  if (!user) return null;

  return (
    <NavbarDropdown
      title={
        <div className="flex items-center gap-2">
          <FaUserCircle size={20} />
          <span className="hidden lg:inline">{user.username}</span>
        </div>
      }
    >
      <div className="px-4 py-2 border-b border-(--border-color) mb-1">
        <p className="text-sm font-medium text-(--text-primary)">
          {user.email}
        </p>
        <p className="text-xs text-(--text-secondary)">
          {user.premium ? "Premium Member" : "Free Plan"}
        </p>
      </div>

      <NavbarDropdownItem
        onClick={() => toast("Feature coming soon", { icon: "🚧" })}
      >
        <div className="flex items-center gap-2">
          <FaUserEdit />
          Edit Profile
        </div>
      </NavbarDropdownItem>

      <NavbarDropdownItem
        onClick={() => toast("Feature coming soon", { icon: "🚧" })}
      >
        <div className="flex items-center gap-2">
          <FaCog />
          Settings
        </div>
      </NavbarDropdownItem>

      <div className="border-t border-(--border-color) my-1"></div>

      <NavbarDropdownItem onClick={() => logout()}>
        <div className="flex items-center gap-2 text-red-500">
          <FaSignOutAlt />
          Logout
        </div>
      </NavbarDropdownItem>
    </NavbarDropdown>
  );
};
