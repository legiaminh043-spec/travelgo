
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  Armchair,
  ClipboardList,
  Users,
  Tag,
  Home,
  LogOut,
} from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("travelgoUser");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/flights",
      label: "Quản lý chuyến bay",
      icon: Plane,
    },
    {
      path: "/admin/seats",
      label: "Quản lý ghế",
      icon: Armchair,
    },
    {
      path: "/admin/bookings",
      label: "Quản lý đặt vé",
      icon: ClipboardList,
    },
    {
      path: "/admin/users",
      label: "Quản lý người dùng",
      icon: Users,
    },
    {
      path: "/admin/promotions",
      label: "Mã giảm giá",
      icon: Tag,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 px-6 py-5">
        <h1 className="text-xl font-bold">TravelGo Admin</h1>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-gray-800 hover:text-white"
        >
          <Home size={20} />
          <span>Về trang chủ</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;

