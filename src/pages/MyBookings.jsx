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
  Armchair,
  CheckCircle2,
  Clock3,
  Ban,
} from "lucide-react";

function parseBookingDate(value) {
  if (!value) return 0;

  const text = String(value).trim();

  // dd/mm/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
    const [day, month, year] = text.split("/");

    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return parsed.getTime();
  }

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split("-");

    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return parsed.getTime();
  }

  const parsed = new Date(text);

  return Number.isNaN(parsed.getTime())
    ? 0
    : parsed.getTime();
}

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState(() => {
    try {
      const savedBookings =
        localStorage.getItem("travelgoBookings");

      if (!savedBookings) {
        return [];
      }

      const parsedBookings = JSON.parse(savedBookings);

      return Array.isArray(parsedBookings)
        ? parsedBookings
        : [];
    } catch (error) {
      console.error(
        "Không thể đọc danh sách vé:",
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

  const userBookings = useMemo(() => {
    if (!currentUser?.email) {
      return [];
    }

    return bookings.filter(
      (booking) =>
        String(booking.email || "").trim().toLowerCase() ===
        String(currentUser.email || "").trim().toLowerCase()
    );
  }, [bookings, currentUser?.email]);

  const [searchTicket, setSearchTicket] = useState("");
  const [airlineFilter, setAirlineFilter] =
    useState("Tất cả");
  const [statusFilter, setStatusFilter] =
    useState("Tất cả");
  const [priceFilter, setPriceFilter] =
    useState("Tất cả");
  const [sortOrder, setSortOrder] =
    useState("Mới nhất");
  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const airlines = [
    "Tất cả",
    ...new Set(
      userBookings
        .map((booking) => booking.airline)
        .filter(Boolean)
    ),
  ];

  const filteredBookings = useMemo(() => {
    let result = [...userBookings];

    if (searchTicket.trim()) {
      const keyword = searchTicket
        .toLowerCase()
        .trim();

      result = result.filter((booking) =>
        String(booking.ticketCode || "")
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (airlineFilter !== "Tất cả") {
      result = result.filter(
        (booking) =>
          booking.airline === airlineFilter
      );
    }

    if (statusFilter !== "Tất cả") {
      result = result.filter(
        (booking) =>
          (booking.status || "Đã đặt") ===
          statusFilter
      );
    }

    if (priceFilter === "Dưới 1 triệu") {
      result = result.filter(
        (booking) =>
          Number(
            booking.finalPrice ?? booking.price ?? 0
          ) < 1000000
      );
    }

    if (priceFilter === "1 - 2 triệu") {
      result = result.filter((booking) => {
        const price = Number(
          booking.finalPrice ?? booking.price ?? 0
        );

        return price >= 1000000 && price <= 2000000;
      });
    }

    if (priceFilter === "Trên 2 triệu") {
      result = result.filter(
        (booking) =>
          Number(
            booking.finalPrice ?? booking.price ?? 0
          ) > 2000000
      );
    }

    if (sortOrder === "Giá thấp → cao") {
      result.sort(
        (a, b) =>
          Number(
            a.finalPrice ?? a.price ?? 0
          ) -
          Number(
            b.finalPrice ?? b.price ?? 0
          )
      );
    }

    if (sortOrder === "Giá cao → thấp") {
      result.sort(
        (a, b) =>
          Number(
            b.finalPrice ?? b.price ?? 0
          ) -
          Number(
            a.finalPrice ?? a.price ?? 0
          )
      );
    }

    if (sortOrder === "Mới nhất") {
      result.sort(
        (a, b) =>
          parseBookingDate(b.bookingDate) -
          parseBookingDate(a.bookingDate)
      );
    }

    return result;
  }, [
    userBookings,
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

    const targetBooking = userBookings.find(
      (booking) => booking.id === id
    );

    if (!targetBooking) {
      return;
    }

    if (targetBooking.status === "Đã hủy") {
      return;
    }

    const updatedBookings = bookings.map(
      (booking) =>
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

    // Hoàn lại 1 ghế cho chuyến bay
    if (targetBooking.flightId) {
      try {
        const savedFlights =
          localStorage.getItem("travelgoFlights");

        if (savedFlights) {
          const flights = JSON.parse(savedFlights);

          if (Array.isArray(flights)) {
            const restoredFlights = flights.map(
              (flight) => {
                if (
                  String(flight.id) ===
                  String(targetBooking.flightId)
                ) {
                  const totalSeats = Number(
                    flight.totalSeats || 180
                  );

                  const currentAvailable = Number(
                    flight.availableSeats ??
                      totalSeats
                  );

                  return {
                    ...flight,
                    availableSeats: Math.min(
                      currentAvailable + 1,
                      totalSeats
                    ),
                  };
                }

                return flight;
              }
            );

            localStorage.setItem(
              "travelgoFlights",
              JSON.stringify(restoredFlights)
            );
          }
        }
      } catch (error) {
        console.error(
          "Lỗi hoàn lại ghế sau khi hủy vé:",
          error
        );
      }
    }

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
    return `${Number(
      price || 0
    ).toLocaleString("vi-VN")} VNĐ`;
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-green-100 text-green-700";

      case "Đã hủy":
        return "bg-red-100 text-red-600";

      case "Đã đặt":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const totalPaid = userBookings
    .filter(
      (booking) =>
        booking.status === "Đã thanh toán"
    )
    .reduce(
      (total, booking) =>
        total +
        Number(
          booking.finalPrice ?? booking.price ?? 0
        ),
      0
    );

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

      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-6 py-10 text-white shadow-lg sm:px-8">
            <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                  TRAVELGO
                </p>

                <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
                  Vé của tôi
                </h1>

                <p className="mt-2 max-w-2xl text-blue-100">
                  Quản lý chuyến bay, thông tin đặt vé và hành
                  trình của bạn.
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-bold text-blue-600 shadow-md transition hover:bg-blue-50"
              >
                ← Trang chủ
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Ticket size={21} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Tổng số vé
                  </p>

                  <p className="text-2xl font-extrabold text-gray-900">
                    {userBookings.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Vé đã thanh toán
                  </p>

                  <p className="text-2xl font-extrabold text-gray-900">
                    {
                      userBookings.filter(
                        (booking) =>
                          booking.status ===
                          "Đã thanh toán"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Plane size={21} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Tổng tiền đã thanh toán
                  </p>

                  <p className="text-lg font-extrabold text-blue-600">
                    {formatPrice(totalPaid)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {userBookings.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Search size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Tìm kiếm & lọc vé
                  </h2>

                  <p className="text-sm text-gray-500">
                    Tìm theo mã vé và điều chỉnh bộ lọc
                  </p>
                </div>
              </div>

              <div className="mt-5 relative">
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <select
                  value={airlineFilter}
                  onChange={(e) =>
                    setAirlineFilter(e.target.value)
                  }
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
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
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
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
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
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
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
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
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-500 transition hover:text-red-600"
                >
                  <X size={16} />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}

          {/* Empty */}
          {userBookings.length === 0 ? (
            <div className="mt-8 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <Plane size={38} />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-gray-900">
                Bạn chưa có vé nào
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                Hãy tìm kiếm và đặt chuyến đi đầu tiên của
                bạn trên TravelGo.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Tìm chuyến đi
              </Link>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="mt-8 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
              <Search
                size={44}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-5 text-xl font-bold text-gray-800">
                Không tìm thấy vé
              </h2>

              <p className="mt-2 text-gray-500">
                Không có vé nào phù hợp với bộ lọc hiện tại.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <div className="mb-4 text-sm text-gray-500">
                Hiển thị{" "}
                <span className="font-bold text-gray-900">
                  {filteredBookings.length}
                </span>{" "}
                / {userBookings.length} vé
              </div>

              <div className="space-y-5">
                {filteredBookings.map((booking) => {
                  const finalPrice = Number(
                    booking.finalPrice ??
                      booking.price ??
                      0
                  );

                  const isCanceled =
                    booking.status === "Đã hủy";

                  return (
                    <div
                      key={booking.id}
                      className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {/* Ticket header */}
                      <div className="border-b border-gray-100 p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                              <Plane size={27} />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-xl font-extrabold text-gray-900">
                                  {booking.airline}
                                </h2>

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                                    booking.status
                                  )}`}
                                >
                                  {booking.status ||
                                    "Đã đặt"}
                                </span>
                              </div>

                              {booking.flightCode && (
                                <p className="mt-1 text-sm text-gray-500">
                                  Chuyến bay{" "}
                                  <span className="font-bold text-blue-600">
                                    {booking.flightCode}
                                  </span>
                                </p>
                              )}

                              <p className="mt-1 text-sm font-semibold text-blue-600">
                                Mã vé:{" "}
                                {booking.ticketCode ||
                                  "Chưa có mã"}
                              </p>

                              <p className="mt-1 text-sm text-gray-400">
                                Đặt ngày:{" "}
                                {booking.bookingDate ||
                                  "Không rõ"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedBooking(
                                  booking
                                )
                              }
                              className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 font-semibold text-blue-600 transition hover:bg-blue-100"
                            >
                              <Eye size={17} />
                              Xem chi tiết
                            </button>

                            {booking.status ===
                              "Đã thanh toán" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleReview(booking)
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-50 px-4 py-2.5 font-semibold text-yellow-600 transition hover:bg-yellow-100"
                              >
                                <Star size={17} />
                                Đánh giá
                              </button>
                            )}

                            {!isCanceled && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancel(
                                    booking.id
                                  )
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-100"
                              >
                                <Ban size={17} />
                                Hủy vé
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Trip info */}
                      <div className="grid gap-6 p-6 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <MapPin size={19} />
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Hành trình
                            </p>

                            <p className="font-bold text-gray-900">
                              {booking.from} →{" "}
                              {booking.to}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Calendar size={19} />
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Ngày đi
                            </p>

                            <p className="font-bold text-gray-900">
                              {booking.date}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-blue-50 p-4">
                          <p className="text-sm text-blue-600">
                            Tổng thanh toán
                          </p>

                          <p className="mt-1 text-xl font-extrabold text-blue-700">
                            {formatPrice(finalPrice)}
                          </p>

                          {Number(
                            booking.discountAmount || 0
                          ) > 0 && (
                            <p className="mt-1 text-sm font-semibold text-green-600">
                              Đã giảm{" "}
                              {formatPrice(
                                booking.discountAmount
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Passenger */}
                      <div className="border-t bg-gray-50 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-bold text-gray-900">
                            Thông tin hành khách
                          </h3>

                          {booking.seat && (
                            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-blue-600">
                              <Armchair size={16} />
                              Ghế {booking.seat}
                            </div>
                          )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm text-gray-500">
                              Họ và tên
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                              {booking.fullName ||
                                "Chưa có thông tin"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Số điện thoại
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                              {booking.phone ||
                                "Chưa có thông tin"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Email
                            </p>

                            <p className="mt-1 break-all font-semibold text-gray-800">
                              {booking.email ||
                                "Chưa có thông tin"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selectedBooking && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="print-ticket max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <Ticket size={27} />

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
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <X size={23} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-3xl border-2 border-dashed border-blue-200 p-6">
                <div className="flex flex-col justify-between gap-5 border-b border-gray-100 pb-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      MÃ VÉ
                    </p>

                    <p className="mt-1 text-2xl font-black tracking-wider text-blue-600">
                      {selectedBooking.ticketCode ||
                        "Chưa có mã"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${getStatusStyle(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status ||
                      "Đã đặt"}
                  </span>
                </div>

                <div className="py-8">
                  <p className="text-center text-sm font-semibold text-gray-500">
                    {selectedBooking.airline}
                  </p>

                  <div className="mt-5 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                    <div>
                      <p className="text-sm text-gray-500">
                        Điểm đi
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-gray-900">
                        {selectedBooking.from}
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Plane
                          size={25}
                          className="rotate-90"
                        />
                      </div>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-gray-500">
                        Điểm đến
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-gray-900">
                        {selectedBooking.to}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 border-t border-gray-100 pt-6 md:grid-cols-4">
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
                      Ghế
                    </p>

                    <p className="mt-1 font-bold text-blue-600">
                      {selectedBooking.seat ||
                        "Chưa chọn"}
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

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Thông tin hành khách
                  </h3>

                  <div className="mt-4 grid gap-5 md:grid-cols-3">
                    <div className="flex gap-3">
                      <User
                        className="shrink-0 text-blue-600"
                        size={20}
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Họ và tên
                        </p>

                        <p className="font-semibold text-gray-800">
                          {selectedBooking.fullName ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone
                        className="shrink-0 text-blue-600"
                        size={20}
                      />

                      <div>
                        <p className="text-xs text-gray-500">
                          Số điện thoại
                        </p>

                        <p className="font-semibold text-gray-800">
                          {selectedBooking.phone ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Mail
                        className="shrink-0 text-blue-600"
                        size={20}
                      />

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Email
                        </p>

                        <p className="break-all font-semibold text-gray-800">
                          {selectedBooking.email ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-6 text-sm text-gray-500">
                  <Clock3 size={16} />

                  Ngày đặt vé:{" "}
                  <span className="font-semibold text-gray-700">
                    {selectedBooking.bookingDate ||
                      "Không rõ"}
                  </span>
                </div>
              </div>

              <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedBooking(null)
                  }
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
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
                    className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white transition hover:bg-yellow-600"
                  >
                    <Star size={18} />
                    Đánh giá
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <Printer size={18} />
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