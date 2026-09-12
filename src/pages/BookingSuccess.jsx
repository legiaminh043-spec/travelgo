import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Ticket, Home, Plane } from "lucide-react";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const airline = searchParams.get("airline") || "Chuyến bay";
  const from = searchParams.get("from") || "Chưa chọn";
  const to = searchParams.get("to") || "Chưa chọn";
  const date = searchParams.get("date") || "Chưa chọn";
  const price = searchParams.get("price") || "0";
  const ticketCode = searchParams.get("ticketCode") || "Chưa có mã";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <CheckCircle
          size={70}
          className="mx-auto text-green-500"
        />

        <h1 className="mt-5 text-3xl font-bold text-gray-800">
          Đặt vé thành công!
        </h1>

        <p className="mt-2 text-gray-500">
          Cảm ơn bạn đã sử dụng TravelGo.
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-blue-300 bg-blue-50 p-6">
          <Ticket
            size={32}
            className="mx-auto text-blue-600"
          />

          <p className="mt-3 text-sm text-gray-500">
            Mã vé của bạn
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {ticketCode}
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-5 text-left">
          <div className="flex items-center gap-3">
            <Plane className="text-blue-600" />

            <div>
              <p className="font-bold">{airline}</p>
              <p className="text-sm text-gray-500">
                {from} → {to}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="text-sm text-gray-500">Ngày đi</p>
              <p className="font-semibold">{date}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Giá vé</p>
              <p className="font-bold text-blue-600">
                {Number(price).toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/my-bookings")}
            className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Vé của tôi
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 font-semibold hover:bg-gray-50"
          >
            <Home size={18} />
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;