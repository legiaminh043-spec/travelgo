import { useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  Bell,
  Plus,
  Search,
  Trash2,
  X,
  Send,
} from "lucide-react";

function AdminNotifications() {
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
      console.error("Không thể đọc thông báo:", error);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
  });

  const filteredNotifications = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return notifications;
    }

    return notifications.filter((notification) => {
      return (
        String(notification.title || "")
          .toLowerCase()
          .includes(keyword) ||
        String(notification.message || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [notifications, search]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);

    localStorage.setItem(
      "travelgoNotifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const handleAddNotification = (event) => {
    event.preventDefault();

    if (!newNotification.title.trim()) {
      alert("Vui lòng nhập tiêu đề.");
      return;
    }

    if (!newNotification.message.trim()) {
      alert("Vui lòng nhập nội dung thông báo.");
      return;
    }

    const notification = {
      id: Date.now(),
      title: newNotification.title.trim(),
      message: newNotification.message.trim(),
      read: false,
      createdAt: new Date().toLocaleString("vi-VN"),
      adminCreated: true,
    };

    const updatedNotifications = [
      notification,
      ...notifications,
    ];

    saveNotifications(updatedNotifications);

    setNewNotification({
      title: "",
      message: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa thông báo này không?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );

    saveNotifications(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(
      (notification) => ({
        ...notification,
        read: true,
      })
    );

    saveNotifications(updatedNotifications);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="ml-64 p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý thông báo
            </h1>

            <p className="mt-2 text-gray-500">
              Tạo và quản lý thông báo gửi đến người dùng.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={19} />
            Tạo thông báo
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Tổng thông báo
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {notifications.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Chưa đọc
            </p>

            <p className="mt-2 text-3xl font-bold text-red-500">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Đã đọc
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {notifications.length - unreadCount}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm thông báo..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="rounded-xl bg-green-50 px-5 py-3 font-semibold text-green-600 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <Bell className="text-blue-600" />

              <div>
                <h2 className="text-xl font-bold">
                  Danh sách thông báo
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Hiển thị {filteredNotifications.length} /{" "}
                  {notifications.length} thông báo
                </p>
              </div>
            </div>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 ${
                    !notification.read
                      ? "border-l-4 border-blue-500 bg-blue-50/40"
                      : ""
                  }`}
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div className="flex gap-4">
                      <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                        <Bell size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-gray-900">
                            {notification.title ||
                              "Thông báo"}
                          </h3>

                          {!notification.read && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-600">
                              CHƯA ĐỌC
                            </span>
                          )}
                        </div>

                        <p className="mt-2 max-w-3xl leading-6 text-gray-600">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          {notification.createdAt ||
                            "Không rõ thời gian"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(notification.id)
                      }
                      className="flex items-center justify-center gap-2 self-start rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={17} />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Bell
                size={50}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-xl font-bold text-gray-700">
                Chưa có thông báo
              </h3>

              <p className="mt-2 text-gray-500">
                Hãy tạo thông báo đầu tiên cho người dùng.
              </p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Tạo thông báo
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Nội dung sẽ được lưu vào hệ thống TravelGo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleAddNotification}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Tiêu đề
                </label>

                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      title: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Ưu đãi mới từ TravelGo"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Nội dung
                </label>

                <textarea
                  rows={5}
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      message: e.target.value,
                    })
                  }
                  placeholder="Nhập nội dung thông báo..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  <Send size={18} />
                  Gửi thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;