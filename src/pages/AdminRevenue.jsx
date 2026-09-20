import { useMemo } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  BarChart3,
  Ticket,
  DollarSign,
  TrendingUp,
  Plane,
  Tag,
} from "lucide-react";

function AdminRevenue() {
  const bookings = useMemo(() => {
    try {
      const saved = localStorage.getItem("travelgoBookings");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Không thể đọc booking:", error);
      return [];
    }
  }, []);

  const flights = useMemo(() => {
    try {
      const saved = localStorage.getItem("travelgoFlights");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Không thể đọc chuyến bay:", error);
      return [];
    }
  }, []);

  const promotions = useMemo(() => {
    try {
      const saved = localStorage.getItem("travelgoPromotions");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Không thể đọc khuyến mãi:", error);
      return [];
    }
  }, []);

  const paidBookings = bookings.filter(
    (booking) => booking.status === "Đã thanh toán"
  );

  const totalRevenue = paidBookings.reduce(
    (total, booking) =>
      total +
      Number(
        booking.finalPrice ??
          booking.price ??
          0
      ),
    0
  );

  const totalTickets = paidBookings.length;

  const averageTicket =
    totalTickets > 0
      ? totalRevenue / totalTickets
      : 0;

  const cancelledTickets = bookings.filter(
    (booking) => booking.status === "Đã hủy"
  ).length;

  const topFlights = [...paidBookings]
    .reduce((result, booking) => {
      const key =
        booking.flightCode ||
        `${booking.airline}-${booking.from}-${booking.to}`;

      const existing = result.find(
        (item) => item.key === key
      );

      const revenue = Number(
        booking.finalPrice ??
          booking.price ??
          0
      );

      if (existing) {
        existing.tickets += 1;
        existing.revenue += revenue;
      } else {
        result.push({
          key,
          flightCode: booking.flightCode || "N/A",
          airline: booking.airline || "Không rõ",
          route: `${booking.from || ""} → ${
            booking.to || ""
          }`,
          tickets: 1,
          revenue,
        });
      }

      return result;
    }, [])
    .sort((a, b) => {
      return b.revenue - a.revenue;
    })
    .slice(0, 5);

  const revenueByAirline = [...paidBookings]
    .reduce((result, booking) => {
      const airline = booking.airline || "Không rõ";

      const existing = result.find(
        (item) => item.airline === airline
      );

      const revenue = Number(
        booking.finalPrice ??
          booking.price ??
          0
      );

      if (existing) {
        existing.revenue += revenue;
        existing.tickets += 1;
      } else {
        result.push({
          airline,
          revenue,
          tickets: 1,
        });
      }

      return result;
    }, [])
    .sort((a, b) => b.revenue - a.revenue);

  const maxAirlineRevenue =
    revenueByAirline.length > 0
      ? Math.max(
          ...revenueByAirline.map(
            (item) => item.revenue
          )
        )
      : 0;

  const totalPromotionUsage = promotions.reduce(
    (total, promotion) =>
      total + Number(promotion.used || 0),
    0
  );

  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString(
      "vi-VN"
    )} VNĐ`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Doanh thu & thống kê
          </h1>

          <p className="mt-2 text-gray-500">
            Tổng quan tình hình kinh doanh của TravelGo
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Tổng doanh thu
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {formatPrice(totalRevenue)}
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <DollarSign size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Vé đã bán
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {totalTickets}
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Ticket size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Giá trị vé trung bình
                </p>

                <p className="mt-2 text-2xl font-bold text-purple-600">
                  {formatPrice(averageTicket)}
                </p>
              </div>

              <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                <TrendingUp size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Vé đã hủy
                </p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  {cancelledTickets}
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-600">
                <BarChart3 size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Plane size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Top chuyến bay
                </h2>

                <p className="text-sm text-gray-500">
                  Chuyến bay mang lại doanh thu cao nhất
                </p>
              </div>
            </div>

            {topFlights.length > 0 ? (
              <div className="space-y-4">
                {topFlights.map((flight, index) => (
                  <div
                    key={flight.key}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                          {index + 1}
                        </div>

                        <div>
                          <p className="font-bold text-gray-900">
                            {flight.flightCode}
                          </p>

                          <p className="text-sm text-gray-500">
                            {flight.airline}
                          </p>

                          <p className="text-sm text-gray-500">
                            {flight.route}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatPrice(
                            flight.revenue
                          )}
                        </p>

                        <p className="text-sm text-gray-500">
                          {flight.tickets} vé
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                Chưa có dữ liệu doanh thu.
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <BarChart3 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Doanh thu theo hãng bay
                </h2>

                <p className="text-sm text-gray-500">
                  So sánh doanh thu giữa các hãng
                </p>
              </div>
            </div>

            {revenueByAirline.length > 0 ? (
              <div className="space-y-5">
                {revenueByAirline.map((item) => {
                  const percentage =
                    maxAirlineRevenue > 0
                      ? (item.revenue /
                          maxAirlineRevenue) *
                        100
                      : 0;

                  return (
                    <div key={item.airline}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <span className="font-semibold text-gray-800">
                          {item.airline}
                        </span>

                        <span className="text-sm font-bold text-green-600">
                          {formatPrice(item.revenue)}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.tickets} vé đã bán
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                Chưa có dữ liệu doanh thu.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Plane className="text-blue-600" />

              <div>
                <p className="text-sm text-gray-500">
                  Tổng chuyến bay
                </p>

                <p className="text-2xl font-bold">
                  {flights.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Tag className="text-orange-600" />

              <div>
                <p className="text-sm text-gray-500">
                  Lượt sử dụng mã giảm giá
                </p>

                <p className="text-2xl font-bold">
                  {totalPromotionUsage}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-600" />

              <div>
                <p className="text-sm text-gray-500">
                  Tỷ lệ vé thanh toán
                </p>

                <p className="text-2xl font-bold">
                  {bookings.length > 0
                    ? `${Math.round(
                        (totalTickets /
                          bookings.length) *
                          100
                      )}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRevenue;