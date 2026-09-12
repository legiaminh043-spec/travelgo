import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, CalendarDays } from "lucide-react";

const defaultFlights = [
  {
    from: "Hà Nội",
    to: "TP. Hồ Chí Minh",
    date: "10/09/2026",
  },
  {
    from: "Hà Nội",
    to: "Đà Nẵng",
    date: "11/09/2026",
  },
  {
    from: "TP. Hồ Chí Minh",
    to: "Hà Nội",
    date: "12/09/2026",
  },
  {
    from: "Đà Nẵng",
    to: "Hà Nội",
    date: "13/09/2026",
  },
];

function Hero() {
  const navigate = useNavigate();

  const [flights, setFlights] = useState(defaultFlights);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

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

  const locations = [
    ...new Set(
      flights
        .flatMap((flight) => [flight.from, flight.to])
        .filter(Boolean)
    ),
  ];

  const destinations = [
    ...new Set(
      flights
        .filter((flight) => !from || flight.from === from)
        .map((flight) => flight.to)
        .filter(Boolean)
    ),
  ];

  const handleFromChange = (value) => {
    setFrom(value);
    setTo("");
  };

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Vui lòng chọn điểm đi, điểm đến và ngày đi!");
      return;
    }

    navigate(
      `/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
        to
      )}&date=${encodeURIComponent(date)}`
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 py-20 md:py-24">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-100">
            TravelGo
          </p>

          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            Đặt vé máy bay dễ dàng
          </h1>

          <p className="mx-auto max-w-2xl text-base text-blue-100 md:text-lg">
            Tìm kiếm chuyến bay nhanh chóng, an toàn và tiện lợi
            cho hành trình của bạn.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-2xl sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800">
              Tìm chuyến bay
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Chọn thông tin hành trình của bạn
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Điểm đi
              </label>

              <div className="relative">
                <MapPin
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                />

                <select
                  value={from}
                  onChange={(e) =>
                    handleFromChange(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Chọn điểm đi</option>

                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Điểm đến
              </label>

              <div className="relative">
                <MapPin
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500"
                />

                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  disabled={!from}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {from
                      ? "Chọn điểm đến"
                      : "Chọn điểm đi trước"}
                  </option>

                  {destinations
                    .filter(
                      (destination) => destination !== from
                    )
                    .map((destination) => (
                      <option
                        key={destination}
                        value={destination}
                      >
                        {destination}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Ngày đi
              </label>

              <div className="relative">
                <CalendarDays
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSearch}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
              >
                <Search size={20} />
                Tìm chuyến bay
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;