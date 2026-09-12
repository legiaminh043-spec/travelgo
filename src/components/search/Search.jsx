import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plane, Clock, CalendarDays, Search } from "lucide-react";

const defaultFlights = [
  {
    id: 1,
    airline: "Vietnam Airlines",
    flightNumber: "VN213",
    from: "Hà Nội",
    to: "TP. Hồ Chí Minh",
    date: "10/09/2026",
    departure: "08:00",
    arrival: "10:15",
    duration: "2h 15m",
    price: 1450000,
  },
  {
    id: 2,
    airline: "Vietjet Air",
    flightNumber: "VJ125",
    from: "Hà Nội",
    to: "TP. Hồ Chí Minh",
    date: "10/09/2026",
    departure: "10:30",
    arrival: "12:40",
    duration: "2h 10m",
    price: 1190000,
  },
  {
    id: 3,
    airline: "Bamboo Airways",
    flightNumber: "QH201",
    from: "Hà Nội",
    to: "Đà Nẵng",
    date: "11/09/2026",
    departure: "07:15",
    arrival: "08:40",
    duration: "1h 25m",
    price: 980000,
  },
  {
    id: 4,
    airline: "Vietnam Airlines",
    flightNumber: "VN171",
    from: "Đà Nẵng",
    to: "Hà Nội",
    date: "13/09/2026",
    departure: "14:20",
    arrival: "15:45",
    duration: "1h 25m",
    price: 1020000,
  },
  {
    id: 5,
    airline: "Vietjet Air",
    flightNumber: "VJ632",
    from: "TP. Hồ Chí Minh",
    to: "Hà Nội",
    date: "12/09/2026",
    departure: "16:10",
    arrival: "18:20",
    duration: "2h 10m",
    price: 1250000,
  },
];

function SearchPage() {
  const [searchParams] = useSearchParams();

  const initialFrom = searchParams.get("from") || "";
  const initialTo = searchParams.get("to") || "";
  const initialDate = searchParams.get("date") || "";

  const [flights, setFlights] = useState(defaultFlights);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate);
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    try {
      const savedFlights = localStorage.getItem("travelgoFlights");

      if (savedFlights) {
        const parsedFlights = JSON.parse(savedFlights);

        if (Array.isArray(parsedFlights) && parsedFlights.length > 0) {
          setFlights(parsedFlights);
        }
      }
    } catch (error) {
      console.error("Không thể đọc danh sách chuyến bay:", error);
    }
  }, []);

  const locations = useMemo(() => {
    return [
      ...new Set(
        flights
          .flatMap((flight) => [flight.from, flight.to])
          .filter(Boolean)
      ),
    ];
  }, [flights]);

  const filteredFlights = useMemo(() => {
    const result = flights.filter((flight) => {
      const matchFrom = !from || flight.from === from;
      const matchTo = !to || flight.to === to;
      const matchDate = !date || flight.date === date;

      return matchFrom && matchTo && matchDate;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "price") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "departure") {
        return String(a.departure).localeCompare(
          String(b.departure)
        );
      }

      return 0;
    });
  }, [flights, from, to, date, sortBy]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " ₫";
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            TRAVELGO
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Tìm chuyến bay
          </h1>

          <p className="mt-2 text-gray-600">
            Chọn chuyến bay phù hợp với hành trình của bạn.
          </p>
        </div>

        {/* Search box */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Điểm đi
              </label>

              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Tất cả điểm đi</option>

                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Điểm đến
              </label>

              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Tất cả điểm đến</option>

                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Ngày đi
              </label>

              <div className="relative">
                <CalendarDays
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <Search size={19} />
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Result header */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {filteredFlights.length} chuyến bay
            </h2>

            {(from || to || date) && (
              <p className="mt-1 text-sm text-gray-500">
                Kết quả theo bộ lọc bạn đã chọn
              </p>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-500"
          >
            <option value="price">
              Giá thấp nhất
            </option>

            <option value="departure">
              Giờ khởi hành
            </option>
          </select>
        </div>

        {/* Flights */}
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr_auto]">
                {/* Airline */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Plane size={21} />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">
                        {flight.airline}
                      </p>

                      <p className="text-sm text-gray-500">
                        {flight.flightNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Departure */}
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-gray-900">
                    {flight.departure}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {flight.from}
                  </p>
                </div>

                {/* Route */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="h-px w-12 bg-gray-200" />
                    <Plane
                      size={17}
                      className="rotate-90 text-blue-500"
                    />
                    <div className="h-px w-12 bg-gray-200" />
                  </div>

                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Clock size={14} />
                    {flight.duration}
                  </div>
                </div>

                {/* Arrival + price */}
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-gray-900">
                    {flight.arrival}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {flight.to}
                  </p>

                  <p className="mt-3 text-lg font-extrabold text-blue-600">
                    {formatPrice(flight.price)}
                  </p>

                  <button
                    type="button"
                    className="mt-3 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Chọn chuyến
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                <CalendarDays size={16} />
                {flight.date}
              </div>
            </div>
          ))}

          {filteredFlights.length === 0 && (
            <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
              <Plane
                size={40}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-lg font-bold text-gray-800">
                Không tìm thấy chuyến bay
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Hãy thử thay đổi điểm đi, điểm đến hoặc ngày đi.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default SearchPage;
