import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plane,
  Menu,
  Bell,
  Globe,
  X,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

function Header() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("travelgoUser");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      setUser(null);
    }

    try {
      const savedNotifications = localStorage.getItem(
        "travelgoNotifications"
      );

      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);

        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      }
    } catch {
      setNotifications([]);
    }
  }, []);

  const isLoggedIn =
    localStorage.getItem("travelgoLoggedIn") === "true";

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("travelgoLoggedIn");
    localStorage.removeItem("travelgoUser");

    setUser(null);
    setMobileMenuOpen(false);

    navigate("/login", { replace: true });
  };

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:py-4">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2"
        >
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <Plane size={22} />
          </div>

          <span className="text-lg font-bold text-blue-600 sm:text-xl">
            TravelGo
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            {t("home")}
          </Link>

          <Link
            to="/search"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            {t("flights")}
          </Link>

          {isLoggedIn && (
            <Link
              to="/my-bookings"
              className="font-medium text-gray-700 hover:text-blue-600"
            >
              {t("myBookings")}
            </Link>
          )}

          {isLoggedIn && user?.role === "admin" && (
            <Link
              to="/admin"
              className="font-medium text-gray-700 hover:text-blue-600"
            >
              {t("admin")}
            </Link>
          )}

          <Link
            to="/"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            {t("services")}
          </Link>

          <Link
            to="/"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            {t("destinations")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5">
            <Globe
              size={17}
              className="text-blue-600"
            />

            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-semibold outline-none sm:text-sm"
            >
              <option value="vi">VI</option>
              <option value="en">EN</option>
            </select>
          </div>

          {isLoggedIn && (
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>
          )}

          {isLoggedIn && user ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user.fullName}
                </p>

                <p className="text-xs text-gray-500">
                  {user.role === "admin"
                    ? "Admin"
                    : "User"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                {t("login")}
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {t("register")}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {t("home")}
            </Link>

            <Link
              to="/search"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {t("flights")}
            </Link>

            {isLoggedIn && (
              <Link
                to="/my-bookings"
                onClick={closeMobileMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                {t("myBookings")}
              </Link>
            )}

            {isLoggedIn && (
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Hồ sơ cá nhân
              </Link>
            )}

            {isLoggedIn &&
              user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  {t("admin")}
                </Link>
              )}

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {t("services")}
            </Link>

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {t("destinations")}
            </Link>

            {isLoggedIn && user ? (
              <div className="mt-3 border-t pt-3">
                <div className="px-4 py-2">
                  <p className="font-semibold text-gray-800">
                    {user.fullName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.role === "admin"
                      ? "Admin"
                      : "User"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-lg bg-red-50 px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-100"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg border border-blue-600 px-4 py-3 text-center font-semibold text-blue-600"
                >
                  {t("login")}
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;