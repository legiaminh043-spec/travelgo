import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Plane,
  Armchair,
  CalendarDays,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const flightId = params.get("flightId") || "";
  const airline = params.get("airline") || "Chưa xác định";
  const from = params.get("from") || "Chưa xác định";
  const to = params.get("to") || "Chưa xác định";
  const date = params.get("date") || "Chưa xác định";
  const price = Number(params.get("price")) || 0;

  const currentUser = JSON.parse(
    localStorage.getItem("travelgoUser") || "null"
  );

  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [error, setError] = useState("");

  // Lấy danh sách ghế đã được đặt của đúng chuyến bay
  const bookings = JSON.parse(
    localStorage.getItem("travelgoBookings") || "[]"
  );

  const occupiedSeats = bookings
    .filter(
      (booking) =>
        String(booking.flightId) === String(flightId) &&
        booking.status !== "Đã hủy" &&
        booking.seat
    )
    .map((booking) => booking.seat);

  const seats = [
    "A1",
    "A2",
    "A3",
    "A4",
    "B1",
    "B2",
    "B3",
    "B4",
    "C1",
    "C2",
    "C3",
    "C4",
    "D1",
    "D2",
    "D3",
    "D4",
    "E1",
    "E2",
    "E3",
    "E4",
  ];

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  };

  const handleSelectSeat = (seat) => {
    if (occupiedSeats.includes(seat)) {
      return;
    }

    setError("");
    setSelectedSeat(seat);
  };

  const handleBooking = (event) => {
    event.preventDefault();
    setError("");

    // Kiểm tra thông tin chuyến bay
    if (!flightId) {
      setError("Không tìm thấy thông tin chuyến bay. Vui lòng chọn lại chuyến bay.");
      return;
    }

    // Kiểm tra ghế
    if (!selectedSeat) {
      setError("Vui lòng chọn ghế trước khi tiếp tục.");
      return;
    }

    // Kiểm tra ghế có vừa được người khác đặt hay không
    if (occupiedSeats.includes(selectedSeat)) {
      setError("Ghế này đã được đặt. Vui lòng chọn ghế khác.");
      setSelectedSeat("");
      return;
    }

    // Kiểm tra thông tin hành khách
    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại.");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    // Kiểm tra định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    // Chuyển sang bước thanh toán
    const paymentParams = new URLSearchParams({
      flightId,
      airline,
      from,
      to,
      date,
      price: String(price),
      seat: selectedSeat,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });

    navigate(`/payment?${paymentParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Đặt vé máy bay
              </h1>
              <p className="text-sm text-slate-500">
                Hoàn tất thông tin để tiếp tục thanh toán
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                1
              </div>
              Đặt vé
            </div>

            <div className="w-16 h-px bg-slate-300" />

            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                2
              </div>
              Thanh toán
            </div>

            <div className="w-16 h-px bg-slate-300" />

            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                3
              </div>
              Hoàn tất
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleBooking}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flight information */}
              <section className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Thông tin chuyến bay
                    </h2>
                    <p className="text-sm text-slate-500">
                      Kiểm tra thông tin trước khi đặt vé
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <Plane className="w-4 h-4" />
                      Hãng bay
                    </div>

                    <p className="font-semibold text-slate-900">
                      {airline}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <CalendarDays className="w-4 h-4" />
                      Ngày bay
                    </div>

                    <p className="font-semibold text-slate-900">
                      {date}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      Điểm đi
                    </div>

                    <p className="font-semibold text-slate-900">
                      {from}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      Điểm đến
                    </div>

                    <p className="font-semibold text-slate-900">
                      {to}
                    </p>
                  </div>
                </div>
              </section>

              {/* Seat selection */}
              <section className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Armchair className="w-5 h-5 text-indigo-600" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Chọn ghế
                      </h2>
                      <p className="text-sm text-slate-500">
                        Chọn một ghế còn trống
                      </p>
                    </div>
                  </div>

                  {selectedSeat && (
                    <div className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                      Ghế {selectedSeat}
                    </div>
                  )}
                </div>

                {/* Seat legend */}
                <div className="flex flex-wrap gap-5 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border bg-white" />
                    <span className="text-slate-600">Còn trống</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-600" />
                    <span className="text-slate-600">Đang chọn</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-slate-300" />
                    <span className="text-slate-600">Đã đặt</span>
                  </div>
                </div>

                {/* Plane cabin */}
                <div className="max-w-md mx-auto">
                  <div className="border-2 border-slate-200 rounded-[40px] p-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100">
                        <Plane className="w-6 h-6 text-slate-500" />
                      </div>

                      <p className="text-xs text-slate-400 mt-2">
                        Đầu máy bay
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {seats.map((seat) => {
                        const isOccupied = occupiedSeats.includes(seat);
                        const isSelected = selectedSeat === seat;

                        return (
                          <button
                            key={seat}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSelectSeat(seat)}
                            aria-label={`Ghế ${seat}${
                              isOccupied
                                ? " đã được đặt"
                                : isSelected
                                ? " đang được chọn"
                                : " còn trống"
                            }`}
                            className={`
                              h-12 rounded-lg border text-sm font-semibold
                              transition-all
                              ${
                                isOccupied
                                  ? "bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
                                  : "bg-white border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              }
                            `}
                          >
                            {seat}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-center mt-6 text-xs text-slate-400">
                      Cuối khoang hành khách
                    </div>
                  </div>
                </div>
              </section>

              {/* Passenger information */}
              <section className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Thông tin hành khách
                    </h2>

                    <p className="text-sm text-slate-500">
                      Thông tin được sử dụng để xác nhận vé
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Họ và tên
                    </label>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nhập họ và tên"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Số điện thoại
                    </label>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <section className="bg-white rounded-2xl border shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-6">
                    Tóm tắt đặt vé
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Chuyến bay
                      </span>

                      <span className="font-medium text-slate-900 text-right">
                        {airline}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Hành trình
                      </span>

                      <span className="font-medium text-slate-900 text-right">
                        {from} → {to}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Ngày bay
                      </span>

                      <span className="font-medium text-slate-900">
                        {date}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Ghế
                      </span>

                      <span className="font-semibold text-blue-600">
                        {selectedSeat || "Chưa chọn"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t my-6" />

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">
                      Tổng tiền
                    </span>

                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(price)}
                    </span>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Security */}
                  <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />

                      <div>
                        <p className="font-semibold text-green-800 text-sm">
                          Thanh toán an toàn
                        </p>

                        <p className="text-xs text-green-700 mt-1">
                          Thông tin đặt vé của bạn được bảo mật.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Tiếp tục thanh toán
                  </button>

                  <p className="text-xs text-center text-slate-400 mt-4">
                    Bạn sẽ được chuyển sang bước thanh toán sau khi xác nhận
                    thông tin.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}