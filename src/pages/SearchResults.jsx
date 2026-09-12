import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapPin, Calendar, Plane, Filter } from "lucide-react";

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
      date: "10/09/2026",
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
      date: "11/09/2026",
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
      date: "12/09/2026",
      time: "14:00",
      price: 1350000,
      totalSeats: 180,
      availableSeats: 180,
      status: "Sắp bay",
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
      const savedFlights = localStorage.getItem("travelgoFlights");

      if (savedFlights) {
        const parsedFlights = JSON.parse(savedFlights);

        if (Array.isArray(parsedFlights) && parsedFlights.length > 0) {
          const updatedFlights = parsedFlights.map((flight) => ({
            ...flight,
            price: Number(flight.price || 0),
            totalSeats: Number(flight.totalSeats || 180),
            availableSeats: Number(
              flight.availableSeats ?? flight.totalSeats ?? 180
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
      console.error("Lỗi đọc travelgoFlights:", error);
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

  const filteredFlights = flights
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

  const airlines = [
    ...new Set(flights.map((flight) => flight.airline)),
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
      )}&price=${encodeURIComponent(flight.price)}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-3xl font-bold">
            Kết quả tìm kiếm
          </h1>

          <p className="mt-2 text-blue-100">
            Tìm hành trình phù hợp với bạn
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm">
            <MapPin className="text-blue-600" />

            <div>
              <p className="text-sm text-gray-500">
                Hành trình
              </p>

              <p className="font-bold">
                {from || "Chưa chọn"} → {to || "Chưa chọn"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm">
            <Calendar className="text-blue-600" />

            <div>
              <p className="text-sm text-gray-500">
                Ngày đi
              </p>

              <p className="font-bold">
                {date || "Chưa chọn"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm">
            <Plane className="text-blue-600" />

            <div>
              <p className="text-sm text-gray-500">
                Dịch vụ
              </p>

              <p className="font-bold">
                Chuyến bay
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Filter className="text-blue-600" />

            <h2 className="text-xl font-bold">
              Lọc chuyến bay
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Hãng bay
              </label>

              <select
                value={airlineFilter}
                onChange={(e) =>
                  setAirlineFilter(e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
              >
                <option value="all">
                  Tất cả hãng bay
                </option>

                {airlines.map((airline) => (
                  <option key={airline} value={airline}>
                    {airline}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Trạng thái
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
              >
                <option value="all">
                  Tất cả trạng thái
                </option>

                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Khoảng giá
              </label>

              <select
                value={priceFilter}
                onChange={(e) =>
                  setPriceFilter(e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
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
              <label className="mb-2 block font-semibold text-gray-700">
                Sắp xếp
              </label>

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
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

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Chuyến bay
          </h2>

          <p className="mt-2 text-gray-500">
            Tìm thấy {filteredFlights.length} chuyến bay
          </p>

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
                key={flight.id || flight.flightCode}
                className="mt-6 rounded-xl border p-6"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-bold">
                        {flight.airline}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          flight.status
                        )}`}
                      >
                        {flight.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {flight.flightCode}
                    </p>

                    <p className="mt-2 text-gray-500">
                      {flight.from} → {flight.to}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {flight.date} • {flight.time}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Ghế còn lại: {availableSeats}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xl font-bold text-blue-600">
                      {Number(
                        flight.price || 0
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>

                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleBooking(flight)}
                      className={`mt-3 rounded-lg px-5 py-2 font-semibold text-white ${
                        disabled
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {flight.status === "Đã hủy"
                        ? "Đã hủy"
                        : flight.status === "Đã bay"
                        ? "Đã bay"
                        : availableSeats <= 0
                        ? "Hết chỗ"
                        : "Đặt ngay"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredFlights.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
              <Plane className="mx-auto mb-3 text-gray-400" />

              <p className="font-semibold text-gray-600">
                Không tìm thấy chuyến bay phù hợp
              </p>
            </div>
          )}
        </div>

        <Link
          to="/"
          className="mt-8 inline-block rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-600"
        >
          ← Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}

export default SearchResults;