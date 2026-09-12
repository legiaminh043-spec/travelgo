
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plane,
  Calendar,
  MapPin,
  Search,
  X,
  Eye,
  Printer,
  User,
  Phone,
  Mail,
  Ticket,
  Star,
} from "lucide-react";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState(() => {
    try {
      const savedBookings = localStorage.getItem("travelgoBookings");

      if (!savedBookings) {
        return [];
      }

      const parsedBookings = JSON.parse(savedBookings);

      return Array.isArray(parsedBookings)
        ? parsedBookings
        : [];
    } catch (error) {
      console.error("Không thể đọc danh sách vé:", error);
      return [];
    }
  });

  const [searchTicket, setSearchTicket] = useState("");
  const [airlineFilter, setAirlineFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [priceFilter, setPriceFilter] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("Mới nhất");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const airlines = [
    "Tất cả",
    ...new Set(
      bookings
        .map((booking) => booking.airline)
        .filter(Boolean)
    ),
  ];

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (searchTicket.trim()) {
      result = result.filter((booking) =>
        (booking.ticketCode || "")
          .toLowerCase()
          .includes(searchTicket.toLowerCase().trim())
      );
    }

    if (airlineFilter !== "Tất cả") {
      result = result.filter(
        (booking) => booking.airline === airlineFilter
      );
    }

    if (statusFilter !== "Tất cả") {
      result = result.filter(
        (booking) =>
          (booking.status || "Đã đặt") === statusFilter
      );
    }

    if (priceFilter === "Dưới 1 triệu") {
      result = result.filter(
        (booking) => Number(booking.price) < 1000000
      );
    }

    if (priceFilter === "1 - 2 triệu") {
      result = result.filter(
        (booking) =>
          Number(booking.price) >= 1000000 &&
          Number(booking.price) <= 2000000
      );
    }

    if (priceFilter === "Trên 2 triệu") {
      result = result.filter(
        (booking) => Number(booking.price) > 2000000
      );
    }

    if (sortOrder === "Giá thấp → cao") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortOrder === "Giá cao → thấp") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    if (sortOrder === "Mới nhất") {
      result.sort(
        (a, b) =>
          new Date(b.bookingDate || 0) -
          new Date(a.bookingDate || 0)
      );
    }

    return result;
  }, [
    bookings,
    searchTicket,
    airlineFilter,
    statusFilter,
    priceFilter,
    sortOrder,
  ]);

  const handleCancel = (id) => {
    const confirmCancel = window.confirm(
      "Bạn có chắc muốn hủy vé này không?"
    );

    if (!confirmCancel) {
      return;
    }

    const updatedBookings = bookings.map((booking) =>
      booking.id === id
        ? {
            ...booking,
            status: "Đã hủy",
          }
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

  const handleReview = (booking) => {
    if (!booking?.ticketCode) {
      return;
    }

    navigate(
      `/flight-review?ticketCode=${encodeURIComponent(
        booking.ticketCode
      )}`
    );
  };

  const clearFilters = () => {
    setSearchTicket("");
    setAirlineFilter("Tất cả");
    setStatusFilter("Tất cả");
    setPriceFilter("Tất cả");
    setSortOrder("Mới nhất");
  };

  const hasFilter =
    searchTicket.trim() !== "" ||
    airlineFilter !== "Tất cả" ||
    statusFilter !== "Tất cả" ||
    priceFilter !== "Tất cả";

  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString(
      "vi-VN"
    )} VNĐ`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .print-ticket,
          .print-ticket * {
            visibility: visible;
          }

          .print-ticket {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 800px !important;
            margin: 0 auto !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Vé của tôi
              </h1>

              <p className="mt-2 text-gray-500">
                Quản lý các chuyến đi bạn đã đặt.
              </p>
            </div>

            <Link
              to="/"
              className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              ← Trang chủ
            </Link>
          </div>

          {bookings.length > 0 && (
            <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Nhập mã vé để tìm kiếm..."
                  value={searchTicket}
                  onChange={(e) =>
                    setSearchTicket(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <select
                  value={airlineFilter}
                  onChange={(e) =>
                    setAirlineFilter(e.target.value)
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  {airlines.map((airline) => (
                    <option
                      key={airline}
                      value={airline}
                    >
                      {airline === "Tất cả"
                        ? "Hãng bay: Tất cả"
                        : airline}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="Tất cả">
                    Trạng thái: Tất cả
                  </option>

                  <option value="Đã thanh toán">
                    Đã thanh toán
                  </option>

                  <option value="Đã đặt">
                    Đã đặt
                  </option>

                  <option value="Đã hủy">
                    Đã hủy
                  </option>
                </select>

                <select
                  value={priceFilter}
                  onChange={(e) =>
                    setPriceFilter(e.target.value)
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="Tất cả">
                    Giá vé: Tất cả
                  </option>

                  <option value="Dưới 1 triệu">
                    Dưới 1 triệu
                  </option>

                  <option value="1 - 2 triệu">
                    1 - 2 triệu
                  </option>

                  <option value="Trên 2 triệu">
                    Trên 2 triệu
                  </option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value)
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="Mới nhất">
                    Mới nhất
                  </option>

                  <option value="Giá thấp → cao">
                    Giá thấp → cao
                  </option>

                  <option value="Giá cao → thấp">
                    Giá cao → thấp
                  </option>
                </select>
              </div>

              {hasFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600"
                >
                  <X size={16} />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
              <Plane
                size={50}
                className="mx-auto text-gray-400"
              />

              <h2 className="mt-4 text-xl font-bold">
                Bạn chưa có vé nào
              </h2>

              <p className="mt-2 text-gray-500">
                Hãy tìm kiếm và đặt chuyến đi đầu tiên của bạn!
              </p>

              <Link
                to="/"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Tìm chuyến đi
              </Link>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
              <Search
                size={50}
                className="mx-auto text-gray-400"
              />

              <h2 className="mt-4 text-xl font-bold">
                Không tìm thấy vé
              </h2>

              <p className="mt-2 text-gray-500">
                Không có vé nào phù hợp với điều kiện tìm kiếm.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <div className="mb-4 text-sm text-gray-500">
                Hiển thị{" "}
                <span className="font-bold text-gray-800">
                  {filteredBookings.length}
                </span>{" "}
                / {bookings.length} vé
              </div>

              <div className="space-y-5">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-4 border-b p-6 md:flex-row md:items-center">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                          <Plane size={28} />
                        </div>

                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            {booking.airline}
                          </h2>

                          {booking.flightCode && (
                            <p className="mt-1 text-sm text-gray-500">
                              Chuyến:{" "}
                              <span className="font-semibold text-blue-600">
                                {booking.flightCode}
                              </span>
                            </p>
                          )}

                          <p className="mt-1 text-sm font-semibold text-blue-600">
                            Mã vé:{" "}
                            {booking.ticketCode ||
                              "Chưa có mã"}
                          </p>

                          <p className="text-sm text-gray-500">
                            Đặt ngày:{" "}
                            {booking.bookingDate ||
                              "Không rõ"}
                          </p>

                          <span
                            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.status === "Đã hủy"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {booking.status || "Đã đặt"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedBooking(booking)
                          }
                          className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          <Eye size={18} />
                          Xem chi tiết
                        </button>

                        {booking.status === "Đã thanh toán" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleReview(booking)
                            }
                            className="flex items-center justify-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 font-semibold text-yellow-600 hover:bg-yellow-100"
                          >
                            <Star size={18} />
                            Đánh giá
                          </button>
                        )}

                        {booking.status !== "Đã hủy" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancel(booking.id)
                            }
                            className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600 hover:bg-red-100"
                          >
                            Hủy vé
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-blue-600" />

                        <div>
                          <p className="text-sm text-gray-500">
                            Hành trình
                          </p>

                          <p className="font-semibold text-gray-800">
                            {booking.from} → {booking.to}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="text-blue-600" />

                        <div>
                          <p className="text-sm text-gray-500">
                            Ngày đi
                          </p>

                          <p className="font-semibold text-gray-800">
                            {booking.date}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Giá vé
                        </p>

                        <p className="text-xl font-bold text-blue-600">
                          {formatPrice(
                            booking.finalPrice ??
                              booking.price
                          )}
                        </p>

                        {booking.discountAmount > 0 && (
                          <p className="mt-1 text-sm text-green-600">
                            Đã giảm{" "}
                            {formatPrice(
                              booking.discountAmount
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t bg-gray-50 p-6">
                      <h3 className="font-bold text-gray-800">
                        Thông tin hành khách
                      </h3>

                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            Họ và tên
                          </p>

                          <p className="font-semibold">
                            {booking.fullName ||
                              "Chưa có thông tin"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Số điện thoại
                          </p>

                          <p className="font-semibold">
                            {booking.phone ||
                              "Chưa có thông tin"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Email
                          </p>

                          <p className="font-semibold break-all">
                            {booking.email ||
                              "Chưa có thông tin"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="print-ticket max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-blue-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <Ticket size={28} />

                <div>
                  <h2 className="text-xl font-bold">
                    Vé điện tử TravelGo
                  </h2>

                  <p className="text-sm text-blue-100">
                    Thông tin xác nhận chuyến bay
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-2 hover:bg-blue-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border-2 border-dashed border-blue-200 p-6">
                <div className="flex flex-col justify-between gap-5 border-b pb-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      MÃ VÉ
                    </p>

                    <p className="text-2xl font-black tracking-wider text-blue-600">
                      {selectedBooking.ticketCode ||
                        "Chưa có mã"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      selectedBooking.status === "Đã hủy"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {selectedBooking.status ||
                      "Đã đặt"}
                  </span>
                </div>

                <div className="py-7">
                  <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                    <div>
                      <p className="text-sm text-gray-500">
                        Điểm đi
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        {selectedBooking.from}
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                        <Plane size={26} />
                      </div>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-gray-500">
                        Điểm đến
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        {selectedBooking.to}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 border-t pt-6 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Hãng bay
                    </p>

                    <p className="mt-1 font-bold text-gray-800">
                      {selectedBooking.airline}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Ngày khởi hành
                    </p>

                    <p className="mt-1 font-bold text-gray-800">
                      {selectedBooking.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Tổng tiền
                    </p>

                    <p className="mt-1 text-xl font-black text-blue-600">
                      {formatPrice(
                        selectedBooking.finalPrice ??
                          selectedBooking.price
                      )}
                    </p>
                  </div>
                </div>

                {selectedBooking.seat && (
                  <div className="mt-6 border-t pt-6">
                    <p className="text-sm text-gray-500">
                      Số ghế
                    </p>

                    <p className="mt-1 font-bold text-blue-600">
                      {selectedBooking.seat}
                    </p>
                  </div>
                )}

                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Thông tin hành khách
                  </h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="flex gap-3">
                      <User
                        className="text-blue-600"
                        size={20}
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Họ và tên
                        </p>

                        <p className="font-semibold">
                          {selectedBooking.fullName ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone
                        className="text-blue-600"
                        size={20}
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Số điện thoại
                        </p>

                        <p className="font-semibold">
                          {selectedBooking.phone ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Mail
                        className="text-blue-600"
                        size={20}
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Email
                        </p>

                        <p className="break-all font-semibold">
                          {selectedBooking.email ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-6 text-sm text-gray-500">
                  <p>
                    Ngày đặt vé:{" "}
                    <span className="font-semibold text-gray-700">
                      {selectedBooking.bookingDate ||
                        "Không rõ"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>

                {selectedBooking.status ===
                  "Đã thanh toán" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleReview(selectedBooking)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600"
                  >
                    <Star size={19} />
                    Đánh giá chuyến bay
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  <Printer size={19} />
                  In vé điện tử
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyBookings;

