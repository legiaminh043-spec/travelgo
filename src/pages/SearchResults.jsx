import { useLocation, Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  MapPin,
  Calendar,
  Plane,
  Filter,
  Clock,
  Armchair,
  ArrowRight,
} from "lucide-react";

function getAutomaticStatus(flight) {
  if (flight.status === "Đã hủy") {
    return "Đã hủy";
  }

  if (!flight.date) {
    return flight.status || "Đang mở bán";
  }

  const dateText = String(flight.date).trim();
  const timeText = String(flight.time || "00:00").trim();

  let day;
  let month;
  let year;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateText)) {
    [day, month, year] = dateText.split("/");
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    [year, month, day] = dateText.split("-");
  } else {
    return flight.status || "Đang mở bán";
  }

  const [hour = "0", minute = "0"] = timeText.split(":");

  const flightDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );

  if (Number.isNaN(flightDate.getTime())) {
    return flight.status || "Đang mở bán";
  }

  const now = new Date();
  const diff = flightDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "Đã bay";
  }

  const hoursLeft = diff / (1000 * 60 * 60);

  if (hoursLeft <= 24) {
    return "Sắp bay";
  }

  return "Đang mở bán";
}

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";

  const [airlineFilter, setAirlineFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const defaultFlights = [
    {
      id: 1,
      airline: "Vietnam Airlines",
      flightCode: "VN123",
      from: "Hà Nội",
      to: "TP. Hồ Chí Minh",
      date: "20/09/2026",
      time: "08:00",
      price: 1200000,
      totalSeats: 180,
      availableSeats: 180,
      status: "Đang mở bán",
    },
    {
      id: 2,
      airline: "Vietjet Air",
      flightCode: "VJ456",
      from: "Hà Nội",
      to: "Đà Nẵng",
      date: "21/09/2026",
      time: "10:30",
      price: 850000,
      totalSeats: 180,
      availableSeats: 180,
      status: "Đang mở bán",
    },
    {
      id: 3,
      airline: "Bamboo Airways",
      flightCode: "QH789",
      from: "TP. Hồ Chí Minh",
      to: "Hà Nội",
      date: "22/09/2026",
      time: "14:00",
      price: 1350000,
      totalSeats: 180,
      availableSeats: 180,
      status: "Đang mở bán",
    },
    {
      id: 4,
      airline: "Vietnam Airlines",
      flightCode: "VN555",
      from: "Đà Nẵng",
      to: "Hà Nội",
      date: "23/09/2026",
      time: "16:30",
      price: 1050000,
      totalSeats: 180,
      availableSeats: 180,
      status: "Đang mở bán",
    },
  ];

  const normalizeText = (value) => {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[.,]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const normalizeDate = (value) => {
    if (!value) {
      return "";
    }

    const text = String(value).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      const [year, month, day] = text.split("-");
      return `${day}/${month}/${year}`;
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(text)) {
      const [day, month, year] = text.split("-");
      return `${day}/${month}/${year}`;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
      return text;
    }

    return text;
  };

  const getFlights = () => {
    try {
      const savedFlights =
        localStorage.getItem("travelgoFlights");

      if (savedFlights) {
        const parsedFlights = JSON.parse(savedFlights);

        if (
          Array.isArray(parsedFlights) &&
          parsedFlights.length > 0
        ) {
          const updatedFlights = parsedFlights.map((flight) => ({
            ...flight,
            price: Number(flight.price || 0),
            totalSeats: Number(flight.totalSeats || 180),
            availableSeats: Number(
              flight.availableSeats ??
                flight.totalSeats ??
                180
            ),
            status: getAutomaticStatus(flight),
          }));

          localStorage.setItem(
            "travelgoFlights",
            JSON.stringify(updatedFlights)
          );

          return updatedFlights;
        }
      }
    } catch (error) {
      console.error(
        "Lỗi đọc travelgoFlights:",
        error
      );
    }

    return defaultFlights.map((flight) => ({
      ...flight,
      status: getAutomaticStatus(flight),
    }));
  };

  const flights = getFlights();

  const normalizedFrom = normalizeText(from);
  const normalizedTo = normalizeText(to);
  const normalizedSearchDate = normalizeDate(date);

  const filteredFlights = useMemo(() => {
    return flights
      .filter((flight) => {
        const flightFrom = normalizeText(flight.from);
        const flightTo = normalizeText(flight.to);
        const flightDate = normalizeDate(flight.date);

        const matchFrom =
          !normalizedFrom ||
          flightFrom.includes(normalizedFrom) ||
          normalizedFrom.includes(flightFrom);

        const matchTo =
          !normalizedTo ||
          flightTo.includes(normalizedTo) ||
          normalizedTo.includes(flightTo);

        const matchDate =
          !normalizedSearchDate ||
          flightDate === normalizedSearchDate;

        const matchAirline =
          airlineFilter === "all" ||
          flight.airline === airlineFilter;

        const matchStatus =
          statusFilter === "all" ||
          flight.status === statusFilter;

        let matchPrice = true;

        if (priceFilter === "under1") {
          matchPrice = flight.price < 1000000;
        }

        if (priceFilter === "1to2") {
          matchPrice =
            flight.price >= 1000000 &&
            flight.price <= 2000000;
        }

        if (priceFilter === "over2") {
          matchPrice = flight.price > 2000000;
        }

        return (
          matchFrom &&
          matchTo &&
          matchDate &&
          matchAirline &&
          matchStatus &&
          matchPrice
        );
      })
      .sort((a, b) => {
        if (sortOrder === "lowToHigh") {
          return a.price - b.price;
        }

        if (sortOrder === "highToLow") {
          return b.price - a.price;
        }

        return 0;
      });
  }, [
    flights,
    normalizedFrom,
    normalizedTo,
    normalizedSearchDate,
    airlineFilter,
    priceFilter,
    statusFilter,
    sortOrder,
  ]);

  const airlines = [
    ...new Set(
      flights.map((flight) => flight.airline)
    ),
  ];

  const statuses = [
    "Đang mở bán",
    "Sắp bay",
    "Đã bay",
    "Đã hủy",
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang mở bán":
        return "bg-green-100 text-green-700";

      case "Sắp bay":
        return "bg-yellow-100 text-yellow-700";

      case "Đã bay":
        return "bg-gray-100 text-gray-700";

      case "Đã hủy":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleBooking = (flight) => {
    if (
      flight.status === "Đã hủy" ||
      flight.status === "Đã bay" ||
      Number(flight.availableSeats || 0) <= 0
    ) {
      return;
    }

    navigate(
      `/booking?flightId=${encodeURIComponent(
        flight.id
      )}&airline=${encodeURIComponent(
        flight.airline
      )}&from=${encodeURIComponent(
        flight.from
      )}&to=${encodeURIComponent(
        flight.to
      )}&date=${encodeURIComponent(
        flight.date
      )}&price=${encodeURIComponent(
        flight.price
      )}`
    );
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "vi-VN"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 py-12 text-white">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-100">
            TRAVELGO
          </p>

          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
            Kết quả tìm kiếm
          </h1>

          <p className="mt-2 text-blue-100">
            Tìm hành trình phù hợp với bạn
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Hành trình
                </p>

                <p className="font-bold text-gray-900">
                  {from || "Chưa chọn"} →{" "}
                  {to || "Chưa chọn"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Calendar size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Ngày đi
                </p>

                <p className="font-bold text-gray-900">
                  {date || "Chưa chọn"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Plane size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Kết quả
                </p>

                <p className="font-bold text-gray-900">
                  {filteredFlights.length} chuyến bay
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Filter size={19} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Lọc chuyến bay
              </h2>

              <p className="text-sm text-gray-500">
                Điều chỉnh kết quả theo nhu cầu
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Hãng bay
              </label>

              <select
                value={airlineFilter}
                onChange={(e) =>
                  setAirlineFilter(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">
                  Tất cả hãng bay
                </option>

                {airlines.map((airline) => (
                  <option
                    key={airline}
                    value={airline}
                  >
                    {airline}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Trạng thái
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">
                  Tất cả trạng thái
                </option>

                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Khoảng giá
              </label>

              <select
                value={priceFilter}
                onChange={(e) =>
                  setPriceFilter(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">
                  Tất cả mức giá
                </option>

                <option value="under1">
                  Dưới 1.000.000 VNĐ
                </option>

                <option value="1to2">
                  1.000.000 - 2.000.000 VNĐ
                </option>

                <option value="over2">
                  Trên 2.000.000 VNĐ
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Sắp xếp
              </label>

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="default">
                  Mặc định
                </option>

                <option value="lowToHigh">
                  Giá thấp → cao
                </option>

                <option value="highToLow">
                  Giá cao → thấp
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Chuyến bay
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tìm thấy{" "}
              <span className="font-semibold text-blue-600">
                {filteredFlights.length}
              </span>{" "}
              chuyến bay phù hợp
            </p>
          </div>

          <div className="space-y-5">
            {filteredFlights.map((flight) => {
              const availableSeats = Number(
                flight.availableSeats || 0
              );

              const disabled =
                availableSeats <= 0 ||
                flight.status === "Đã hủy" ||
                flight.status === "Đã bay";

              return (
                <div
                  key={
                    flight.id ||
                    flight.flightCode
                  }
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Airline */}
                      <div className="min-w-0 lg:w-60">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Plane size={22} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-lg font-bold text-gray-900">
                              {flight.airline}
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-blue-600">
                              {flight.flightCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex flex-1 items-center justify-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-extrabold text-gray-900">
                            {flight.time}
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-600">
                            {flight.from}
                          </p>
                        </div>

                        <div className="hidden flex-col items-center sm:flex">
                          <div className="flex items-center gap-2">
                            <span className="h-px w-10 bg-gray-200" />

                            <Plane
                              size={18}
                              className="rotate-90 text-blue-500"
                            />

                            <span className="h-px w-10 bg-gray-200" />
                          </div>

                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={13} />
                            Bay thẳng
                          </div>
                        </div>

                        <ArrowRight
                          size={18}
                          className="text-gray-300 sm:hidden"
                        />

                        <div className="text-center">
                          <p className="text-2xl font-extrabold text-gray-900">
                            —
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-600">
                            {flight.to}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="lg:w-60 lg:text-right">
                        <div className="flex items-center gap-2 lg:justify-end">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              flight.status
                            )}`}
                          >
                            {flight.status}
                          </span>
                        </div>

                        <p className="mt-3 text-2xl font-extrabold text-blue-600">
                          {formatPrice(
                            flight.price
                          )}{" "}
                          VNĐ
                        </p>

                        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500 lg:justify-end">
                          <Armchair size={15} />
                          Còn {availableSeats} ghế
                        </div>

                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            handleBooking(flight)
                          }
                          className={`mt-4 w-full rounded-xl px-5 py-3 font-bold transition lg:w-auto ${
                            disabled
                              ? "cursor-not-allowed bg-gray-200 text-gray-400"
                              : "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
                          }`}
                        >
                          {flight.status ===
                          "Đã hủy"
                            ? "Đã hủy"
                            : flight.status ===
                              "Đã bay"
                            ? "Đã bay"
                            : availableSeats <=
                              0
                            ? "Hết chỗ"
                            : "Đặt ngay"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar
                          size={15}
                          className="text-blue-500"
                        />
                        {flight.date}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock
                          size={15}
                          className="text-blue-500"
                        />
                        Khởi hành {flight.time}
                      </div>

                      <div className="flex items-center gap-2">
                        <Armchair
                          size={15}
                          className="text-blue-500"
                        />
                        {availableSeats}/
                        {flight.totalSeats} ghế
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFlights.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Plane size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-800">
                Không tìm thấy chuyến bay phù hợp
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Hãy thử thay đổi bộ lọc hoặc thông tin
                tìm kiếm.
              </p>
            </div>
          )}
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center rounded-xl border border-blue-600 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          ← Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}

export default SearchResults;