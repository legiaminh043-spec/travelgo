
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Ticket,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Plane,
  Armchair,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const savedBookings = JSON.parse(
      localStorage.getItem("travelgoBookings") || "[]"
    );

    setBookings(savedBookings);
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const keyword = search.toLowerCase().trim();

    const matchesSearch =
      booking.ticketCode?.toLowerCase().includes(keyword) ||
      booking.fullName?.toLowerCase().includes(keyword) ||
      booking.phone?.toLowerCase().includes(keyword) ||
      booking.email?.toLowerCase().includes(keyword) ||
      booking.flightCode?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "Tất cả" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBookings = bookings.length;

  const paidBookings = bookings.filter(
    (booking) => booking.status === "Đã thanh toán"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Đã hủy"
  ).length;

  const totalCustomers = new Set(
    bookings.map((booking) => booking.email).filter(Boolean)
  ).size;

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  };

  const handleCancel = (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn hủy vé này không?"
    );

    if (!confirmed) return;

    const updatedBookings = bookings.map((booking) =>
      booking.id === id
        ? { ...booking, status: "Đã hủy" }
        : booking
    );

    setBookings(updatedBookings);

    localStorage.setItem(
      "travelgoBookings",
      JSON.stringify(updatedBookings)
    );

    if (selectedBooking?.id === id) {
      setSelectedBooking({
        ...selectedBooking,
        status: "Đã hủy",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              TravelGo Admin
            </h1>

            <p className="text-sm text-gray-500">
              Quản lý vé đặt
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Về trang chủ
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Tổng số vé
                </p>

                <p className="text-3xl font-bold mt-2">
                  {totalBookings}
                </p>
              </div>

              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <Ticket size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Đã thanh toán
                </p>

                <p className="text-3xl font-bold mt-2">
                  {paidBookings}
                </p>
              </div>

              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Đã hủy
                </p>

                <p className="text-3xl font-bold mt-2">
                  {cancelledBookings}
                </p>
              </div>

              <div className="bg-red-100 text-red-600 p-3 rounded-xl">
                <XCircle size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Khách hàng
                </p>

                <p className="text-3xl font-bold mt-2">
                  {totalCustomers}
                </p>
              </div>

              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">
                Danh sách vé
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Quản lý các vé khách hàng đã đặt
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm mã vé, tên, SĐT..."
                  className="w-full md:w-72 pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border rounded-lg outline-none"
              >
                <option value="Tất cả">
                  Tất cả trạng thái
                </option>

                <option value="Đã thanh toán">
                  Đã thanh toán
                </option>

                <option value="Đã hủy">
                  Đã hủy
                </option>
              </select>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <Ticket
                size={48}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-500 mt-4">
                Không tìm thấy vé nào.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="py-4 px-3">Mã vé</th>
                    <th className="py-4 px-3">Khách hàng</th>
                    <th className="py-4 px-3">Hành trình</th>
                    <th className="py-4 px-3">Ghế</th>
                    <th className="py-4 px-3">Ngày bay</th>
                    <th className="py-4 px-3">Giá vé</th>
                    <th className="py-4 px-3">Trạng thái</th>
                    <th className="py-4 px-3">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="py-4 px-3">
                        <span className="font-semibold text-blue-600">
                          {booking.ticketCode}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <p className="font-medium">
                          {booking.fullName}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.phone}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.email}
                        </p>
                      </td>

                      <td className="py-4 px-3">
                        <p className="font-medium">
                          {booking.from} → {booking.to}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.airline}
                        </p>

                        {booking.flightCode && (
                          <p className="text-sm text-blue-500">
                            {booking.flightCode}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium">
                          <Armchair size={15} />
                          {booking.seat || "Chưa chọn"}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        {booking.date}
                      </td>

                      <td className="py-4 px-3 font-semibold">
                        {formatPrice(booking.price)}
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === "Đã hủy"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setSelectedBooking(booking)
                            }
                            className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium flex items-center gap-1"
                          >
                            <Eye size={16} />
                            Chi tiết
                          </button>

                          {booking.status !== "Đã hủy" ? (
                            <button
                              onClick={() =>
                                handleCancel(booking.id)
                              }
                              className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                            >
                              Hủy vé
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Đã hủy
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5 text-sm text-gray-500">
            Hiển thị {filteredBookings.length} / {totalBookings} vé
          </div>
        </div>
      </main>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="text-xl font-bold">
                  Chi tiết vé
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Mã vé: {selectedBooking.ticketCode}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-blue-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Plane className="text-blue-600" size={22} />

                  <div>
                    <p className="font-semibold">
                      {selectedBooking.airline}
                    </p>

                    {selectedBooking.flightCode && (
                      <p className="text-sm text-gray-500">
                        Chuyến bay {selectedBooking.flightCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Điểm đi
                    </p>

                    <p className="font-semibold">
                      {selectedBooking.from}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Điểm đến
                    </p>

                    <p className="font-semibold">
                      {selectedBooking.to}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Ngày bay
                    </p>

                    <p className="font-semibold">
                      {selectedBooking.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Ghế
                    </p>

                    <p className="font-semibold text-blue-600">
                      {selectedBooking.seat || "Chưa chọn"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3">
                  Thông tin hành khách
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users
                      size={18}
                      className="text-gray-500"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Họ và tên
                      </p>

                      <p className="font-medium">
                        {selectedBooking.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone
                      size={18}
                      className="text-gray-500"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Số điện thoại
                      </p>

                      <p className="font-medium">
                        {selectedBooking.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                    <Mail
                      size={18}
                      className="text-gray-500"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Email
                      </p>

                      <p className="font-medium">
                        {selectedBooking.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Tổng tiền
                  </p>

                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(selectedBooking.price)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Trạng thái
                  </p>

                  <span
                    className={`inline-flex px-3 py-1 mt-1 rounded-full text-sm font-medium ${
                      selectedBooking.status === "Đã hủy"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {selectedBooking.createdAt && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  Đặt vé:{" "}
                  {new Date(
                    selectedBooking.createdAt
                  ).toLocaleString("vi-VN")}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;

