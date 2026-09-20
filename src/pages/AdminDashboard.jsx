import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plane,
  Ticket,
  Users,
  DollarSign,
  Armchair,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const defaultFlights = [
  {
    id: 1,
    airline: "Vietnam Airlines",
    flightCode: "VN123",
    from: "Hà Nội",
    to: "TP. Hồ Chí Minh",
    date: "10/09/2026",
    time: "08:00",
    price: 1200000,
    totalSeats: 180,
    availableSeats: 180,
  },
  {
    id: 2,
    airline: "Vietjet Air",
    flightCode: "VJ456",
    from: "Hà Nội",
    to: "Đà Nẵng",
    date: "11/09/2026",
    time: "10:30",
    price: 850000,
    totalSeats: 180,
    availableSeats: 180,
  },
  {
    id: 3,
    airline: "Bamboo Airways",
    flightCode: "QH789",
    from: "TP. Hồ Chí Minh",
    to: "Hà Nội",
    date: "12/09/2026",
    time: "14:00",
    price: 1350000,
    totalSeats: 180,
    availableSeats: 180,
  },
  {
    id: 4,
    airline: "Vietnam Airlines",
    flightCode: "VN555",
    from: "Đà Nẵng",
    to: "Hà Nội",
    date: "13/09/2026",
    time: "16:30",
    price: 1050000,
    totalSeats: 180,
    availableSeats: 180,
  },
];

function AdminDashboard() {
  const flights = useMemo(() => {
    try {
      const saved = localStorage.getItem("travelgoFlights");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Không thể đọc danh sách chuyến bay:", error);
    }

    return defaultFlights;
  }, []);

  const bookings = useMemo(() => {
    try {
      const saved = localStorage.getItem("travelgoBookings");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Không thể đọc danh sách đặt vé:", error);
    }

    return [];
  }, []);

  const users = useMemo(() => {
    try {
      const savedUsers = localStorage.getItem("travelgoUsers");

      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      const currentUser = localStorage.getItem("travelgoUser");

      if (currentUser) {
        const user = JSON.parse(currentUser);
        return [user];
      }
    } catch (error) {
      console.error("Không thể đọc danh sách người dùng:", error);
    }

    return [];
  }, []);

  const statistics = useMemo(() => {
    const activeBookings = bookings.filter(
      (booking) => booking.status !== "Đã hủy"
    );

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "Đã hủy"
    );

    const revenue = activeBookings.reduce((total, booking) => {
      return total + Number(booking.price || 0);
    }, 0);

    const totalSeats = flights.reduce((total, flight) => {
      return total + Number(flight.totalSeats || 0);
    }, 0);

    const availableSeats = flights.reduce((total, flight) => {
      return total + Number(flight.availableSeats || 0);
    }, 0);

    const bookedSeats = Math.max(totalSeats - availableSeats, 0);

    return {
      totalFlights: flights.length,
      totalBookings: activeBookings.length,
      cancelledBookings: cancelledBookings.length,
      revenue,
      totalUsers: users.length,
      totalSeats,
      availableSeats,
      bookedSeats,
    };
  }, [flights, bookings, users]);

  const recentBookings = [...bookings]
    .sort((a, b) => {
      return Number(b.createdAt || 0) - Number(a.createdAt || 0);
    })
    .slice(0, 5);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " ₫";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Tổng quan hoạt động của TravelGo
          </p>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Tổng chuyến bay
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {statistics.totalFlights}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Plane size={26} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Vé đã bán
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {statistics.totalBookings}
                </h2>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <Ticket size={26} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Người dùng
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {statistics.totalUsers}
                </h2>
              </div>

              <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                <Users size={26} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Doanh thu
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                  {formatPrice(statistics.revenue)}
                </h2>
              </div>

              <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
                <DollarSign size={26} />
              </div>
            </div>
          </div>
        </div>

        {/* Thống kê ghế */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Armchair className="text-blue-600" size={24} />

              <div>
                <p className="text-sm text-gray-500">
                  Tổng số ghế
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {statistics.totalSeats}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Armchair className="text-green-600" size={24} />

              <div>
                <p className="text-sm text-gray-500">
                  Ghế còn trống
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {statistics.availableSeats}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Ticket className="text-orange-600" size={24} />

              <div>
                <p className="text-sm text-gray-500">
                  Ghế đã đặt
                </p>

                <p className="text-2xl font-bold text-orange-600">
                  {statistics.bookedSeats}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tỷ lệ ghế */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
              Tình trạng ghế
            </h2>

            <span className="text-sm text-gray-500">
              {statistics.totalSeats > 0
                ? Math.round(
                    (statistics.bookedSeats /
                      statistics.totalSeats) *
                      100
                  )
                : 0}
              % đã đặt
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width:
                  statistics.totalSeats > 0
                    ? `${
                        (statistics.bookedSeats /
                          statistics.totalSeats) *
                        100
                      }%`
                    : "0%",
              }}
            />
          </div>
        </div>

        {/* Danh sách chuyến bay */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Chuyến bay
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Danh sách các chuyến bay hiện tại
              </p>
            </div>

            <Link
              to="/admin/flights"
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Xem tất cả
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-4">Chuyến bay</th>
                  <th className="px-6 py-4">Hãng bay</th>
                  <th className="px-6 py-4">Tuyến bay</th>
                  <th className="px-6 py-4">Ngày</th>
                  <th className="px-6 py-4">Ghế</th>
                  <th className="px-6 py-4">Giá</th>
                </tr>
              </thead>

              <tbody>
                {flights.slice(0, 5).map((flight) => (
                  <tr
                    key={flight.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {flight.flightCode}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {flight.airline}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {flight.from} → {flight.to}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {flight.date}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        {flight.availableSeats || 0}/
                        {flight.totalSeats || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {formatPrice(flight.price)}
                    </td>
                  </tr>
                ))}

                {flights.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Chưa có chuyến bay
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Đặt vé gần đây */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Đặt vé gần đây
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                5 lượt đặt vé mới nhất
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Xem tất cả
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="p-6">
            {recentBookings.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Chưa có lượt đặt vé nào
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <div
                    key={booking.ticketCode || index}
                    className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-800">
                          {booking.fullName || "Khách hàng"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            booking.status === "Đã hủy"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {booking.status || "Đã đặt"}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>
                          Mã vé:{" "}
                          <strong className="text-gray-700">
                            {booking.ticketCode || "---"}
                          </strong>
                        </span>

                        <span>
                          {booking.airline || "---"}{" "}
                          {booking.flightCode
                            ? `- ${booking.flightCode}`
                            : ""}
                        </span>

                        {booking.seat && (
                          <span>
                            Ghế:{" "}
                            <strong className="text-gray-700">
                              {booking.seat}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(booking.price)}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 md:justify-end">
                        <CalendarDays size={15} />

                        {booking.date || "---"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vé đã hủy */}
        {statistics.cancelledBookings > 0 && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              Có {statistics.cancelledBookings} vé đã bị hủy.
            </p>

            <Link
              to="/admin/bookings"
              className="mt-2 inline-block text-sm font-medium text-red-600 hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;