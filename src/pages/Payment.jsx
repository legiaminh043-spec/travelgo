import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  Building2,
  Plane,
  CheckCircle,
  Armchair,
  Tag,
} from "lucide-react";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promotionCode, setPromotionCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [promotionMessage, setPromotionMessage] = useState("");

  const searchParams = new URLSearchParams(location.search);

  const airline = searchParams.get("airline") || "Chuyến bay";
  const from = searchParams.get("from") || "Chưa chọn";
  const to = searchParams.get("to") || "Chưa chọn";
  const date = searchParams.get("date") || "Chưa chọn";
  const price = Number(searchParams.get("price") || 0);
  const fullName = searchParams.get("fullName") || "";
  const phone = searchParams.get("phone") || "";
  const email = searchParams.get("email") || "";
  const flightId = searchParams.get("flightId") || "";
  const seat = searchParams.get("seat") || "";

  const discountAmount = appliedPromotion
    ? appliedPromotion.type === "percent"
      ? (price * Number(appliedPromotion.value)) / 100
      : Math.min(Number(appliedPromotion.value), price)
    : 0;

  const finalPrice = Math.max(price - discountAmount, 0);

  const handleApplyPromotion = () => {
    const code = promotionCode.trim().toUpperCase();

    if (!code) {
      setPromotionMessage("Vui lòng nhập mã giảm giá.");
      setAppliedPromotion(null);
      return;
    }

    const savedPromotions = localStorage.getItem(
      "travelgoPromotions"
    );

    if (!savedPromotions) {
      setPromotionMessage("Không tìm thấy mã giảm giá.");
      setAppliedPromotion(null);
      return;
    }

    try {
      const promotions = JSON.parse(savedPromotions);

      if (!Array.isArray(promotions)) {
        setPromotionMessage("Không tìm thấy mã giảm giá.");
        setAppliedPromotion(null);
        return;
      }

      const promotion = promotions.find(
        (item) =>
          String(item.code || "")
            .trim()
            .toUpperCase() === code
      );

      if (!promotion) {
        setPromotionMessage("Mã giảm giá không hợp lệ.");
        setAppliedPromotion(null);
        return;
      }

      if (promotion.status !== "Đang hoạt động") {
        setPromotionMessage("Mã giảm giá đang tạm dừng.");
        setAppliedPromotion(null);
        return;
      }

      const used = Number(promotion.used || 0);
      const maxUses = Number(promotion.maxUses || 0);
      const minPrice = Number(promotion.minPrice || 0);

      if (maxUses > 0 && used >= maxUses) {
        setPromotionMessage(
          "Mã giảm giá đã hết lượt sử dụng."
        );
        setAppliedPromotion(null);
        return;
      }

      if (price < minPrice) {
        setPromotionMessage(
          `Đơn hàng phải từ ${minPrice.toLocaleString(
            "vi-VN"
          )} VNĐ để sử dụng mã này.`
        );
        setAppliedPromotion(null);
        return;
      }

      setAppliedPromotion(promotion);
      setPromotionMessage(
        "Áp dụng mã giảm giá thành công!"
      );
    } catch (error) {
      console.error("Lỗi đọc mã giảm giá:", error);

      setPromotionMessage(
        "Không thể kiểm tra mã giảm giá."
      );

      setAppliedPromotion(null);
    }
  };

  const handleRemovePromotion = () => {
    setAppliedPromotion(null);
    setPromotionCode("");
    setPromotionMessage("");
  };

  const createNotification = (ticketCode) => {
    try {
      const savedNotifications = localStorage.getItem(
        "travelgoNotifications"
      );

      let notifications = [];

      if (savedNotifications) {
        const parsedNotifications =
          JSON.parse(savedNotifications);

        if (Array.isArray(parsedNotifications)) {
          notifications = parsedNotifications;
        }
      }

      const newNotification = {
        id: Date.now(),
        title: "Đặt vé thành công 🎉",
        message: `Bạn đã thanh toán thành công vé ${airline} từ ${from} đến ${to}. Mã vé: ${ticketCode}.`,
        ticketCode,
        read: false,
        createdAt: new Date().toLocaleString("vi-VN"),
        email,
      };

      notifications.unshift(newNotification);

      localStorage.setItem(
        "travelgoNotifications",
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Lỗi tạo thông báo:", error);
    }
  };

  const handlePayment = () => {
    if (!flightId) {
      alert("Không xác định được chuyến bay.");
      return;
    }

    const savedFlights = localStorage.getItem(
      "travelgoFlights"
    );

    if (savedFlights) {
      try {
        const flights = JSON.parse(savedFlights);

        if (Array.isArray(flights)) {
          const selectedFlight = flights.find(
            (flight) =>
              String(flight.id) === String(flightId)
          );

          if (selectedFlight) {
            const currentAvailableSeats = Number(
              selectedFlight.availableSeats ??
                selectedFlight.totalSeats ??
                0
            );

            if (currentAvailableSeats <= 0) {
              alert("Chuyến bay đã hết ghế!");
              return;
            }

            const updatedFlights = flights.map((flight) => {
              if (
                String(flight.id) === String(flightId)
              ) {
                return {
                  ...flight,
                  availableSeats:
                    currentAvailableSeats - 1,
                };
              }

              return flight;
            });

            localStorage.setItem(
              "travelgoFlights",
              JSON.stringify(updatedFlights)
            );
          }
        }
      } catch (error) {
        console.error(
          "Lỗi xử lý chuyến bay:",
          error
        );
      }
    }

    if (appliedPromotion) {
      try {
        const savedPromotions =
          localStorage.getItem("travelgoPromotions");

        if (savedPromotions) {
          const promotions = JSON.parse(savedPromotions);

          if (Array.isArray(promotions)) {
            const updatedPromotions = promotions.map(
              (promotion) => {
                if (
                  String(
                    promotion.code || ""
                  ).toUpperCase() ===
                  String(
                    appliedPromotion.code || ""
                  ).toUpperCase()
                ) {
                  return {
                    ...promotion,
                    used:
                      Number(promotion.used || 0) + 1,
                  };
                }

                return promotion;
              }
            );

            localStorage.setItem(
              "travelgoPromotions",
              JSON.stringify(updatedPromotions)
            );
          }
        }
      } catch (error) {
        console.error(
          "Lỗi cập nhật lượt sử dụng mã:",
          error
        );
      }
    }

    const ticketCode = `TG-${Date.now()}`;

    const booking = {
      id: Date.now(),
      ticketCode,
      flightId,
      airline,
      from,
      to,
      date,
      price,
      originalPrice: price,
      discountAmount,
      finalPrice,
      promotionCode: appliedPromotion
        ? appliedPromotion.code
        : "",
      seat,
      fullName,
      phone,
      email,
      paymentMethod,
      status: "Đã thanh toán",
      bookingDate: new Date().toLocaleDateString(
        "vi-VN"
      ),
    };

    try {
      const savedBookings = localStorage.getItem(
        "travelgoBookings"
      );

      let bookings = [];

      if (savedBookings) {
        const parsedBookings = JSON.parse(
          savedBookings
        );

        if (Array.isArray(parsedBookings)) {
          bookings = parsedBookings;
        }
      }

      bookings.unshift(booking);

      localStorage.setItem(
        "travelgoBookings",
        JSON.stringify(bookings)
      );
    } catch (error) {
      console.error(
        "Lỗi lưu thông tin đặt vé:",
        error
      );

      alert("Không thể lưu thông tin đặt vé.");
      return;
    }

    createNotification(ticketCode);

    navigate(
      `/booking-success?airline=${encodeURIComponent(
        airline
      )}&from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(
        to
      )}&date=${encodeURIComponent(
        date
      )}&price=${encodeURIComponent(
        finalPrice
      )}&seat=${encodeURIComponent(
        seat
      )}&ticketCode=${encodeURIComponent(
        ticketCode
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Thanh toán
        </h1>

        <p className="mt-2 text-gray-500">
          Chọn phương thức thanh toán cho chuyến đi của bạn.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Plane size={28} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {airline}
              </h2>

              <p className="text-gray-500">
                {from} → {to}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Ngày bay: {date}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t pt-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Ghế đã chọn
              </p>

              <div className="mt-1 flex items-center gap-2">
                <Armchair
                  size={20}
                  className="text-blue-600"
                />

                <p className="font-bold text-blue-600">
                  {seat || "Chưa chọn"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Giá gốc
              </p>

              <p className="text-xl font-bold text-gray-700">
                {price.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Tag
              size={22}
              className="text-blue-600"
            />

            <h2 className="text-xl font-bold">
              Mã giảm giá
            </h2>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={promotionCode}
              onChange={(e) =>
                setPromotionCode(e.target.value)
              }
              placeholder="Nhập mã giảm giá"
              disabled={!!appliedPromotion}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 uppercase outline-none focus:border-blue-500"
            />

            {!appliedPromotion ? (
              <button
                type="button"
                onClick={handleApplyPromotion}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Áp dụng
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRemovePromotion}
                className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
              >
                Bỏ mã
              </button>
            )}
          </div>

          {promotionMessage && (
            <p
              className={`mt-3 text-sm ${
                appliedPromotion
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {promotionMessage}
            </p>
          )}

          {appliedPromotion && (
            <div className="mt-4 rounded-lg bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-green-700">
                  Mã {appliedPromotion.code}
                </span>

                <span className="font-bold text-green-700">
                  -
                  {discountAmount.toLocaleString(
                    "vi-VN"
                  )}{" "}
                  VNĐ
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Phương thức thanh toán
          </h2>

          <div className="mt-5 space-y-4">
            <button
              type="button"
              onClick={() =>
                setPaymentMethod("card")
              }
              className={`flex w-full items-center justify-between rounded-xl border p-5 text-left ${
                paymentMethod === "card"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <CreditCard className="text-blue-600" />

                <div>
                  <p className="font-bold">
                    Thẻ ngân hàng
                  </p>

                  <p className="text-sm text-gray-500">
                    Thanh toán bằng thẻ ngân hàng
                  </p>
                </div>
              </div>

              {paymentMethod === "card" && (
                <CheckCircle className="text-blue-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setPaymentMethod("wallet")
              }
              className={`flex w-full items-center justify-between rounded-xl border p-5 text-left ${
                paymentMethod === "wallet"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <Wallet className="text-blue-600" />

                <div>
                  <p className="font-bold">
                    Ví điện tử
                  </p>

                  <p className="text-sm text-gray-500">
                    Thanh toán bằng ví điện tử
                  </p>
                </div>
              </div>

              {paymentMethod === "wallet" && (
                <CheckCircle className="text-blue-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setPaymentMethod("bank")
              }
              className={`flex w-full items-center justify-between rounded-xl border p-5 text-left ${
                paymentMethod === "bank"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <Building2 className="text-blue-600" />

                <div>
                  <p className="font-bold">
                    Chuyển khoản ngân hàng
                  </p>

                  <p className="text-sm text-gray-500">
                    Chuyển khoản trực tiếp
                  </p>
                </div>
              </div>

              {paymentMethod === "bank" && (
                <CheckCircle className="text-blue-600" />
              )}
            </button>
          </div>

          <div className="mt-8 rounded-xl bg-gray-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Giá vé
              </span>

              <span className="font-semibold">
                {price.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-green-600">
                  Giảm giá
                </span>

                <span className="font-semibold text-green-600">
                  -
                  {discountAmount.toLocaleString(
                    "vi-VN"
                  )}{" "}
                  VNĐ
                </span>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-lg font-bold">
                Tổng thanh toán
              </span>

              <span className="text-2xl font-bold text-blue-600">
                {finalPrice.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            className="mt-6 w-full rounded-lg bg-blue-600 py-4 text-lg font-bold text-white hover:bg-blue-700"
          >
            Thanh toán{" "}
            {finalPrice.toLocaleString("vi-VN")} VNĐ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;