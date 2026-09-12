
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
    <section className="relative bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Đặt vé máy bay dễ dàng
          </h1>

          <p className="text-lg text-blue-100">
            Tìm kiếm chuyến bay nhanh chóng, an toàn và tiện lợi
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-2xl">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Điểm đi
              </label>

              <div className="relative">
                <MapPin
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={from}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  disabled={!from}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {from ? "Chọn điểm đến" : "Chọn điểm đi trước"}
                  </option>

                  {destinations
                    .filter((destination) => destination !== from)
                    .map((destination) => (
                      <option key={destination} value={destination}>
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
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
