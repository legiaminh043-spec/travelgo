import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Ticket,
  Home,
  Plane,
  CalendarDays,
  Armchair,
  Download,
} from "lucide-react";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const airline = searchParams.get("airline") || "Chuyến bay";
  const from = searchParams.get("from") || "Chưa chọn";
  const to = searchParams.get("to") || "Chưa chọn";
  const date = searchParams.get("date") || "Chưa chọn";
  const price = searchParams.get("price") || "0";
  const seat = searchParams.get("seat") || "Chưa chọn";
  const ticketCode =
    searchParams.get("ticketCode") || "Chưa có mã";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Success message */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle
              size={48}
              className="text-green-500"
            />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
            Đặt vé thành công!
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Cảm ơn bạn đã sử dụng TravelGo. Vé điện tử của bạn
            đã được xác nhận thành công.
          </p>
        </div>

        {/* E-ticket */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl">
          {/* Ticket header */}
          <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-7 text-white sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <Ticket size={25} />
                </div>

                <div>
                  <p className="text-sm text-blue-100">
                    VÉ ĐIỆN TỬ
                  </p>

                  <h2 className="text-2xl font-extrabold">
                    TravelGo
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-blue-100">
                  Mã vé
                </p>

                <p className="mt-1 text-lg font-extrabold">
                  {ticketCode}
                </p>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="p-6 sm:p-8">
            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
              <p className="text-sm font-semibold text-blue-600">
                {airline}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">
                    {from}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Điểm đi
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center">
                  <div className="h-px flex-1 bg-blue-200" />

                  <div className="mx-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Plane
                      size={18}
                      className="rotate-90"
                    />
                  </div>

                  <div className="h-px flex-1 bg-blue-200" />
                </div>

                <div className="text-right">
                  <p className="text-2xl font-extrabold text-gray-900">
                    {to}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Điểm đến
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
                  <Armchair size={17} />
                  <span className="text-sm">
                    Ghế
                  </span>
                </div>

                <p className="mt-2 font-bold text-blue-600">
                  {seat}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm text-blue-600">
                  Tổng thanh toán
                </p>

                <p className="mt-2 font-extrabold text-blue-700">
                  {Number(price).toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-7 border-t border-dashed border-gray-300" />

            {/* Status */}
            <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
              <CheckCircle
                size={22}
                className="shrink-0 text-green-500"
              />

              <div>
                <p className="font-bold text-green-700">
                  Thanh toán thành công
                </p>

                <p className="mt-1 text-sm text-green-600">
                  Vé của bạn đã được lưu vào hệ thống.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Vé của tôi
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                <Download size={18} />
                In vé
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                <Home size={18} />
                Trang chủ
              </button>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-5 text-center text-sm text-gray-500">
          Vui lòng lưu mã vé để thuận tiện tra cứu và quản lý
          chuyến đi.
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;