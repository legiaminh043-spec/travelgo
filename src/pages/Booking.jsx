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
} from "lucide-react";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");

  const occupiedSeats = (() => {
    try {
      const savedBookings = localStorage.getItem("travelgoBookings");
      if (!savedBookings) return [];

      const bookings = JSON.parse(savedBookings);
      if (!Array.isArray(bookings)) return [];

      return bookings
        .filter((booking) =>
          String(booking.flightId || "") === String(flightId) &&
          booking.status !== "Đã hủy" &&
          booking.seat
        )
        .map((booking) => String(booking.seat));
    } catch (error) {
      console.error("Lỗi đọc ghế đã đặt:", error);
      return [];
    }
  })();

  const searchParams = new URLSearchParams(location.search);

  const flightId = searchParams.get("flightId") || "";
  const airline = searchParams.get("airline") || "Chuyến bay";
  const from = searchParams.get("from") || "Chưa chọn";
  const to = searchParams.get("to") || "Chưa chọn";
  const date = searchParams.get("date") || "Chưa chọn";
  const price = searchParams.get("price") || "0";

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

  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedSeat) {
      alert("Vui lòng chọn ghế trước khi tiếp tục!");
      return;
    }

    navigate(
      `/payment?flightId=${encodeURIComponent(
        flightId
      )}&airline=${encodeURIComponent(
        airline
      )}&from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(
        to
      )}&date=${encodeURIComponent(
        date
      )}&price=${encodeURIComponent(
        price
      )}&fullName=${encodeURIComponent(
        fullName
      )}&phone=${encodeURIComponent(
        phone
      )}&email=${encodeURIComponent(
        email
      )}&seat=${encodeURIComponent(
        selectedSeat
      )}`
    );
  };

  const formattedPrice = Number(price).toLocaleString("vi-VN");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 py-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
            TRAVELGO
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
            Hoàn tất đặt vé
          </h1>

          <p className="mt-2 max-w-2xl text-blue-100">
            Điền thông tin hành khách và chọn ghế để tiếp tục
            thanh toán.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </div>

            <span className="mx-3 hidden text-sm font-semibold text-blue-600 sm:block">
              Đặt vé
            </span>

            <div className="h-px w-10 bg-gray-300 sm:w-20" />

            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-sm font-bold text-gray-400">
              2
            </div>

            <span className="ml-3 hidden text-sm font-semibold text-gray-400 sm:block">
              Thanh toán
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Flight information */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Plane size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Thông tin chuyến bay
                    </h2>

                    <p className="text-sm text-gray-500">
                      Kiểm tra lại hành trình trước khi đặt vé
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Hãng hàng không
                      </p>

                      <p className="mt-1 text-lg font-extrabold text-gray-900">
                        {airline}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-xl font-extrabold text-gray-900">
                          {from}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Điểm đi
                        </p>
                      </div>

                      <div className="flex items-center">
                        <div className="h-px w-8 bg-blue-200 sm:w-12" />

                        <Plane
                          size={17}
                          className="mx-1 rotate-90 text-blue-500"
                        />

                        <div className="h-px w-8 bg-blue-200 sm:w-12" />
                      </div>

                      <div className="text-center">
                        <p className="text-xl font-extrabold text-gray-900">
                          {to}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Điểm đến
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDays size={17} />
                      <span className="text-sm">
                        Ngày đi
                      </span>
                    </div>

                    <p className="mt-2 font-bold text-gray-900">
                      {date}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={17} />
                      <span className="text-sm">
                        Hành trình
                      </span>
                    </div>

                    <p className="mt-2 font-bold text-gray-900">
                      {from} → {to}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-sm text-blue-600">
                      Giá vé
                    </p>

                    <p className="mt-2 font-extrabold text-blue-700">
                      {formattedPrice} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat selection */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Armchair size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Chọn ghế
                    </h2>

                    <p className="text-sm text-gray-500">
                      Chọn vị trí ghế phù hợp với bạn
                    </p>
                  </div>
                </div>

                {selectedSeat && (
                  <div className="hidden rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 sm:block">
                    Ghế {selectedSeat}
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <div className="mx-auto mb-6 flex max-w-md items-center justify-center rounded-xl bg-white py-3 text-sm font-bold text-gray-500 shadow-sm">
                  ĐẦU MÁY BAY
                </div>

                <div className="mx-auto max-w-md">
                  <div className="mb-4 grid grid-cols-4 gap-3">
                    <div className="text-center text-xs font-semibold text-gray-400">
                      A
                    </div>
                    <div className="text-center text-xs font-semibold text-gray-400">
                      B
                    </div>
                    <div className="text-center text-xs font-semibold text-gray-400">
                      C
                    </div>
                    <div className="text-center text-xs font-semibold text-gray-400">
                      D
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {seats.slice(0, 16).map((seat) => {
                      const occupied = occupiedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={occupied}
                          onClick={() => setSelectedSeat(seat)}
                          className={`rounded-xl border-2 px-2 py-3 text-sm font-bold transition ${
                            occupied
                              ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400"
                              : selectedSeat === seat
                              ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>

                  <div className="my-5 h-px bg-gray-200" />

                  <div className="grid grid-cols-4 gap-3">
                    {seats.slice(16).map((seat) => {
                      const occupied = occupiedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={occupied}
                          onClick={() => setSelectedSeat(seat)}
                          className={`rounded-xl border-2 px-2 py-3 text-sm font-bold transition ${
                            occupied
                              ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400"
                              : selectedSeat === seat
                              ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-gray-200 bg-white" />
                  Ghế trống
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-blue-600" />
                  Ghế đang chọn

                  <span className="h-4 w-4 rounded bg-gray-200" />
                  Ghế đã đặt
                </div>
              </div>

              {selectedSeat && (
                <div className="mt-5 flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-blue-700">
                  <CheckCircle2 size={20} />

                  <span>
                    Bạn đang chọn ghế{" "}
                    <strong>{selectedSeat}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Passenger information */}
            <form
              onSubmit={handleBooking}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <User size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Thông tin hành khách
                  </h2>

                  <p className="text-sm text-gray-500">
                    Thông tin này được sử dụng cho vé và liên hệ
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Họ và tên
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                    <User
                      size={19}
                      className="text-gray-400"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Nhập họ và tên"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      className="w-full bg-transparent px-3 py-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Số điện thoại
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                    <Phone
                      size={19}
                      className="text-gray-400"
                    />

                    <input
                      type="tel"
                      required
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      className="w-full bg-transparent px-3 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                    <Mail
                      size={19}
                      className="text-gray-400"
                    />

                    <input
                      type="email"
                      required
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="w-full bg-transparent px-3 py-3 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  Thông tin của bạn được sử dụng để hoàn tất
                  đặt vé và hỗ trợ trong quá trình chuyến đi.
                </p>
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
              >
                Tiếp tục thanh toán
                <span>→</span>
              </button>
            </form>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="bg-gray-900 px-6 py-5 text-white">
                <p className="text-sm text-gray-300">
                  Tạm tính
                </p>

                <p className="mt-1 text-3xl font-extrabold">
                  {formattedPrice} VNĐ
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-gray-900">
                  Tóm tắt đặt vé
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Hãng bay
                    </span>

                    <span className="text-right font-semibold text-gray-900">
                      {airline}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Hành trình
                    </span>

                    <span className="text-right font-semibold text-gray-900">
                      {from} → {to}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Ngày đi
                    </span>

                    <span className="font-semibold text-gray-900">
                      {date}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Ghế
                    </span>

                    <span className="font-semibold text-blue-600">
                      {selectedSeat || "Chưa chọn"}
                    </span>
                  </div>
                </div>

                <div className="my-5 border-t border-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Tổng cộng
                  </span>

                  <span className="text-xl font-extrabold text-blue-600">
                    {formattedPrice} VNĐ
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                  Chọn ghế và điền đầy đủ thông tin để tiếp tục
                  đến bước thanh toán.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Booking;