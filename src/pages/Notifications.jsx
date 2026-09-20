import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ArrowLeft,
  Ticket,
  Info,
  AlertCircle,
  PartyPopper,
} from "lucide-react";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "travelgoNotifications"
      );

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(
        "Không thể đọc thông báo:",
        error
      );

      return [];
    }
  });

  const currentUser = (() => {
    try {
      const savedUser = localStorage.getItem("travelgoUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Không thể đọc tài khoản hiện tại:", error);
      return null;
    }
  })();

  const currentUserEmail = String(
    currentUser?.email || ""
  )
    .trim()
    .toLowerCase();

  const userNotifications = useMemo(() => {
    if (!currentUserEmail) {
      return [];
    }

    return notifications.filter(
      (notification) =>
        String(notification.email || "")
          .trim()
          .toLowerCase() === currentUserEmail
    );
  }, [notifications, currentUserEmail]);

  const [filter, setFilter] = useState("all");

  const unreadCount = userNotifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return userNotifications.filter(
        (notification) => !notification.read
      );
    }

    if (filter === "read") {
      return userNotifications.filter(
        (notification) => notification.read
      );
    }

    return userNotifications;
  }, [userNotifications, filter]);

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);

    localStorage.setItem(
      "travelgoNotifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(
      (notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
    );

    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(
      (notification) =>
        String(notification.email || "")
          .trim()
          .toLowerCase() === currentUserEmail
          ? {
              ...notification,
              read: true,
            }
          : notification
    );

    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );

    saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ thông báo không?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedNotifications = notifications.filter(
      (notification) =>
        String(notification.email || "")
          .trim()
          .toLowerCase() !== currentUserEmail
    );

    saveNotifications(updatedNotifications);
  };

  const getNotificationIcon = (notification) => {
    const title = String(
      notification.title || ""
    ).toLowerCase();

    if (
      title.includes("đặt vé") ||
      title.includes("thanh toán") ||
      title.includes("vé")
    ) {
      return (
        <div className="rounded-xl bg-green-100 p-3 text-green-600">
          <Ticket size={22} />
        </div>
      );
    }

    if (
      title.includes("khuyến") ||
      title.includes("ưu đãi")
    ) {
      return (
        <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
          <PartyPopper size={22} />
        </div>
      );
    }

    if (
      title.includes("cảnh báo") ||
      title.includes("lỗi")
    ) {
      return (
        <div className="rounded-xl bg-red-100 p-3 text-red-600">
          <AlertCircle size={22} />
        </div>
      );
    }

    return (
      <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
        <Info size={22} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-10 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-5 flex items-center gap-2 text-blue-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3">
              <Bell size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Thông báo
              </h1>

              <p className="mt-1 text-blue-100">
                Quản lý các thông báo từ TravelGo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-gray-500">
                Tổng số thông báo
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {userNotifications.length}
              </p>

              <p className="mt-1 text-sm text-red-500">
                {unreadCount} thông báo chưa đọc
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck size={17} />
                Đọc tất cả
              </button>

              <button
                type="button"
                onClick={clearAllNotifications}
                disabled={userNotifications.length === 0}
                className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={17} />
                Xóa tất cả
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                filter === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Tất cả
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                filter === "unread"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Chưa đọc
            </button>

            <button
              type="button"
              onClick={() => setFilter("read")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                filter === "read"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Đã đọc
            </button>
          </div>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="mt-6 space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md ${
                  !notification.read
                    ? "border-l-4 border-blue-600"
                    : ""
                }`}
              >
                <div className="flex gap-4">
                  {getNotificationIcon(notification)}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-gray-900">
                            {notification.title ||
                              "Thông báo TravelGo"}
                          </h2>

                          {!notification.read && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-600">
                              MỚI
                            </span>
                          )}
                        </div>

                        <p className="mt-2 leading-6 text-gray-600">
                          {notification.message ||
                            "Bạn có một thông báo mới từ TravelGo."}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs text-gray-400">
                        {notification.createdAt ||
                          "Không rõ thời gian"}
                      </p>
                    </div>

                    {notification.ticketCode && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                        <Ticket
                          size={16}
                          className="text-blue-600"
                        />

                        <span className="text-gray-500">
                          Mã vé:
                        </span>

                        <span className="font-bold text-blue-600">
                          {notification.ticketCode}
                        </span>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          <Check size={16} />
                          Đánh dấu đã đọc
                        </button>
                      )}

                      {notification.ticketCode && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/flight-review?ticketCode=${encodeURIComponent(
                                notification.ticketCode
                              )}`
                            )
                          }
                          className="rounded-lg bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                        >
                          Xem vé
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteNotification(notification.id)
                        }
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-sm">
            <Bell
              size={50}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-xl font-bold text-gray-700">
              {filter === "unread"
                ? "Không có thông báo chưa đọc"
                : filter === "read"
                ? "Không có thông báo đã đọc"
                : "Chưa có thông báo"}
            </h2>

            <p className="mt-2 text-gray-500">
              Các thông báo mới từ TravelGo sẽ xuất hiện ở đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;