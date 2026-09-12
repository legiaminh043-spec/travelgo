import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Plane, Armchair } from "lucide-react";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");

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
      )}&price=${price}&fullName=${encodeURIComponent(
        fullName
      )}&phone=${encodeURIComponent(
        phone
      )}&email=${encodeURIComponent(
        email
      )}&seat=${encodeURIComponent(selectedSeat)}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Đặt vé chuyến bay
        </h1>

        <p className="mt-2 text-gray-500">
          Hoàn tất thông tin để đặt chuyến đi của bạn.
        </p>

        {/* Thông tin chuyến bay */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Plane size={28} />
            </div>

            <div>
              <h2 className="text-xl font-bold">{airline}</h2>

              <p className="text-gray-500">
                {from} → {to}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t pt-5 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Ngày đi</p>
              <p className="font-semibold">{date}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Hành trình</p>
              <p className="font-semibold">
                {from} → {to}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Giá vé</p>
              <p className="font-bold text-blue-600">
                {Number(price).toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
        </div>

        {/* Chọn ghế */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Armchair className="text-blue-600" size={22} />

            <h2 className="text-xl font-bold">
              Chọn ghế
            </h2>
          </div>

          <p className="mt-2 text-gray-500">
            Vui lòng chọn một ghế cho chuyến bay.
          </p>

          <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-10">
            {seats.map((seat) => (
              <button
                key={seat}
                type="button"
                onClick={() => setSelectedSeat(seat)}
                className={`rounded-lg border px-3 py-3 font-semibold transition ${
                  selectedSeat === seat
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                {seat}
              </button>
            ))}
          </div>

          {selectedSeat && (
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-blue-700">
              Ghế đã chọn:{" "}
              <span className="font-bold">{selectedSeat}</span>
            </div>
          )}
        </div>

        {/* Thông tin hành khách */}
        <form
          onSubmit={handleBooking}
          className="mt-6 rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">
            Thông tin hành khách
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">
                Họ và tên
              </label>

              <div className="flex items-center rounded-lg border px-3">
                <User size={20} className="text-gray-400" />

                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  className="w-full px-3 py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Số điện thoại
              </label>

              <div className="flex items-center rounded-lg border px-3">
                <Phone size={20} className="text-gray-400" />

                <input
                  type="tel"
                  required
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="w-full px-3 py-3 outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Email
              </label>

              <div className="flex items-center rounded-lg border px-3">
                <Mail size={20} className="text-gray-400" />

                <input
                  type="email"
                  required
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full px-3 py-3 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Tiếp tục thanh toán
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;