import { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  Plane,
  Users,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
} from "lucide-react";

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

const createSeats = (totalSeats = 180) => {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  for (let i = 0; i < totalSeats; i++) {
    const row = rows[Math.floor(i / 6)] || `R${Math.floor(i / 6) + 1}`;
    const number = (i % 6) + 1;

    seats.push({
      id: `${row}${number}`,
      status: "available",
    });
  }

  return seats;
};

const normalizeFlights = (flights) => {
  return flights.map((flight) => ({
    ...flight,
    totalSeats: Number(flight.totalSeats) || 180,
    availableSeats:
      flight.availableSeats !== undefined
        ? Number(flight.availableSeats)
        : Number(flight.totalSeats) || 180,
  }));
};

function AdminSeats() {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedFlights = localStorage.getItem("travelgoFlights");
      const savedBookings = localStorage.getItem("travelgoBookings");

      const flightData = savedFlights
        ? normalizeFlights(JSON.parse(savedFlights))
        : defaultFlights;

      const bookingData = savedBookings ? JSON.parse(savedBookings) : [];

      setFlights(flightData);
      setBookings(Array.isArray(bookingData) ? bookingData : []);

      if (flightData.length > 0) {
        setSelectedFlightId(String(flightData[0].id));
      }
    } catch (error) {
      console.error("Không thể đọc dữ liệu:", error);
      setFlights(defaultFlights);
      setBookings([]);
    }
  };

  const selectedFlight = useMemo(() => {
    return flights.find(
      (flight) => String(flight.id) === String(selectedFlightId)
    );
  }, [flights, selectedFlightId]);

  const filteredFlights = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return flights;
    }

    return flights.filter((flight) => {
      return (
        flight.flightCode?.toLowerCase().includes(keyword) ||
        flight.airline?.toLowerCase().includes(keyword) ||
        flight.from?.toLowerCase().includes(keyword) ||
        flight.to?.toLowerCase().includes(keyword)
      );
    });
  }, [flights, search]);

  const bookedSeatIds = useMemo(() => {
    if (!selectedFlight) {
      return [];
    }

    return bookings
      .filter((booking) => {
        const sameFlight =
          String(booking.flightId) === String(selectedFlight.id);

        const activeBooking =
          booking.status !== "Đã hủy" &&
          booking.status !== "Đã huỷ";

        return sameFlight && activeBooking && booking.seat;
      })
      .map((booking) => booking.seat);
  }, [bookings, selectedFlight]);

  const seats = useMemo(() => {
    if (!selectedFlight) {
      return [];
    }

    return createSeats(selectedFlight.totalSeats).map((seat) => ({
      ...seat,
      status: bookedSeatIds.includes(seat.id) ? "booked" : "available",
    }));
  }, [selectedFlight, bookedSeatIds]);

  const availableCount = seats.filter(
    (seat) => seat.status === "available"
  ).length;

  const bookedCount = seats.filter(
    (seat) => seat.status === "booked"
  ).length;

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };

  const handleRefresh = () => {
    setSelectedSeat(null);
    loadData();
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý ghế
            </h1>
            <p className="mt-1 text-gray-500">
              Theo dõi tình trạng ghế của từng chuyến bay
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RefreshCw size={18} />
            Làm mới
          </button>
        </div>

        {/* Search + Select */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Tìm chuyến bay
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Mã chuyến bay, hãng bay, địa điểm..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Chọn chuyến bay
              </label>

              <select
                value={selectedFlightId}
                onChange={(e) => {
                  setSelectedFlightId(e.target.value);
                  setSelectedSeat(null);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
              >
                {filteredFlights.length === 0 ? (
                  <option value="">Không có chuyến bay</option>
                ) : (
                  filteredFlights.map((flight) => (
                    <option key={flight.id} value={flight.id}>
                      {flight.flightCode} - {flight.airline} - {flight.from} →{" "}
                      {flight.to}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {selectedFlight ? (
          <>
            {/* Flight information */}
            <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <Plane size={24} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {selectedFlight.flightCode}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedFlight.airline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-gray-700">
                    <span className="font-medium">
                      {selectedFlight.from}
                    </span>

                    <span className="mx-3 text-gray-400">→</span>

                    <span className="font-medium">
                      {selectedFlight.to}
                    </span>

                    <span className="mx-3 text-gray-300">|</span>

                    <span>{selectedFlight.date}</span>

                    <span className="mx-2">•</span>

                    <span>{selectedFlight.time}</span>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-500">Giá vé</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(selectedFlight.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                    <Armchair size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Tổng số ghế</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedFlight.totalSeats}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-3 text-green-600">
                    <CheckCircle size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Ghế trống</p>
                    <p className="text-2xl font-bold text-green-600">
                      {availableCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-3 text-red-600">
                    <Users size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Ghế đã đặt</p>
                    <p className="text-2xl font-bold text-red-600">
                      {bookedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat map */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Sơ đồ ghế
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Nhấn vào ghế để xem thông tin
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded border border-gray-300 bg-white" />
                    Ghế trống
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded bg-red-500" />
                    Đã đặt
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded bg-blue-500" />
                    Đang chọn
                  </div>
                </div>
              </div>

              {/* Cockpit */}
              <div className="mx-auto mb-8 max-w-2xl">
                <div className="rounded-t-[50%] border-2 border-gray-300 bg-gray-100 py-4 text-center">
                  <Plane className="mx-auto mb-1 text-gray-500" size={24} />
                  <span className="text-sm font-semibold text-gray-600">
                    ĐẦU MÁY BAY
                  </span>
                </div>
              </div>

              {/* Seats */}
              <div className="mx-auto max-w-4xl overflow-x-auto">
                <div className="min-w-[650px] rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <div className="mb-4 grid grid-cols-8 gap-3 text-center text-xs font-semibold text-gray-500">
                    <div></div>
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                    <div></div>
                    <div>D</div>
                    <div>E</div>
                    <div>F</div>
                  </div>

                  <div className="space-y-3">
                    {Array.from({
                      length: Math.ceil(selectedFlight.totalSeats / 6),
                    }).map((_, rowIndex) => {
                      const rowNumber = rowIndex + 1;

                      return (
                        <div
                          key={rowNumber}
                          className="grid grid-cols-8 items-center gap-3"
                        >
                          <div className="text-center text-sm font-semibold text-gray-500">
                            {rowNumber}
                          </div>

                          {Array.from({ length: 6 }).map((_, seatIndex) => {
                            const seatId = `${String.fromCharCode(
                              65 + seatIndex
                            )}${rowNumber}`;

                            const seat = seats.find(
                              (item) => item.id === seatId
                            );

                            if (!seat) {
                              return (
                                <div
                                  key={seatIndex}
                                  className="h-10"
                                />
                              );
                            }

                            const isBooked = seat.status === "booked";
                            const isSelected =
                              selectedSeat?.id === seat.id;

                            return (
                              <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                className={`flex h-10 items-center justify-center gap-1 rounded-lg border text-sm font-semibold transition ${
                                  isBooked
                                    ? "cursor-pointer border-red-500 bg-red-500 text-white hover:bg-red-600"
                                    : isSelected
                                    ? "border-blue-600 bg-blue-500 text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                                }`}
                              >
                                <Armchair size={15} />
                                {seat.id}
                              </button>
                            );
                          })}

                          <div className="hidden md:block" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected seat */}
              {selectedSeat && (
                <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">
                        Ghế đang xem
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <Armchair className="text-blue-600" size={22} />

                        <span className="text-xl font-bold text-gray-800">
                          Ghế {selectedSeat.id}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {selectedSeat.status === "booked" ? (
                        <>
                          <p className="font-semibold text-red-600">
                            Đã đặt
                          </p>
                          <p className="text-xs text-gray-500">
                            Ghế này đã có hành khách
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-green-600">
                            Còn trống
                          </p>
                          <p className="text-xs text-gray-500">
                            Có thể đặt
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Plane className="mx-auto mb-4 text-gray-300" size={48} />

            <h2 className="text-xl font-bold text-gray-700">
              Chưa có chuyến bay
            </h2>

            <p className="mt-2 text-gray-500">
              Hãy thêm chuyến bay trong trang quản lý chuyến bay.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSeats;