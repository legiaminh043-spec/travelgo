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
  CalendarDays,
  MapPin,
  ShieldCheck,
  ArrowLeft,
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

  const currentUser = (() => {
    try {
      const savedUser = localStorage.getItem("travelgoUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Không thể đọc tài khoản hiện tại:", error);
      return null;
    }
  })();

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

  const createNotification = (ticketCode, notificationEmail) => {
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
        email: notificationEmail || currentUser?.email || "",
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
    if (!currentUser?.email) {
      alert("Vui lòng đăng nhập trước khi thanh toán.");
      navigate("/login");
      return;
    }

    if (!flightId) {
      alert("Không xác định được chuyến bay.");
      return;
    }

    const savedFlights = localStorage.getItem(
      "travelgoFlights"
    );

    if (!savedFlights) {
      alert("Không tìm thấy dữ liệu chuyến bay.");
      return;
    }

    try {
      const flights = JSON.parse(savedFlights);

      if (!Array.isArray(flights)) {
        alert("Dữ liệu chuyến bay không hợp lệ.");
        return;
      }

      const selectedFlight = flights.find(
        (flight) => String(flight.id) === String(flightId)
      );

      if (!selectedFlight) {
        alert("Không tìm thấy chuyến bay này.");
        return;
      }

      const currentAvailableSeats = Number(
        selectedFlight.availableSeats ??
          selectedFlight.totalSeats ??
          0
      );

      const savedBookings = localStorage.getItem(
        "travelgoBookings"
      );

      if (savedBookings) {
        try {
          const bookings = JSON.parse(savedBookings);

          if (Array.isArray(bookings)) {
            const seatAlreadyBooked = bookings.some(
              (booking) =>
                String(booking.flightId || "") ===
                  String(flightId) &&
                String(booking.seat || "") ===
                  String(seat) &&
                booking.status !== "Đã hủy"
            );

            if (seatAlreadyBooked) {
              alert(
                "Ghế này đã được đặt. Vui lòng quay lại chọn ghế khác."
              );
              return;
            }
          }
        } catch (error) {
          console.error(
            "Lỗi kiểm tra ghế đã đặt:",
            error
          );
        }
      }

      if (currentAvailableSeats <= 0) {
        alert("Chuyến bay đã hết ghế!");
        return;
      }

      const updatedFlights = flights.map((flight) => {
        if (String(flight.id) === String(flightId)) {
          return {
            ...flight,
            availableSeats: currentAvailableSeats - 1,
          };
        }

        return flight;
      });

      localStorage.setItem(
        "travelgoFlights",
        JSON.stringify(updatedFlights)
      );
    } catch (error) {
      console.error("Lỗi xử lý chuyến bay:", error);
      alert("Không thể xử lý chuyến bay.");
      return;
    }

    if (appliedPromotion) {
      try {
        const savedPromotions =
          localStorage.getItem(
            "travelgoPromotions"
          );

        if (savedPromotions) {
          const promotions = JSON.parse(
            savedPromotions
          );

          if (Array.isArray(promotions)) {
            const updatedPromotions = promotions.map(
              (promotion) => {
                if (
                  String(promotion.code || "")
                    .trim()
                    .toUpperCase() ===
                  String(
                    appliedPromotion.code || ""
                  )
                    .trim()
                    .toUpperCase()
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
      fullName: fullName || currentUser.fullName || "",
      phone: phone || currentUser.phone || "",
      email: email || currentUser.email || "",
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

    createNotification(ticketCode, booking.email);

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

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("vi-VN");

  const paymentMethods = [
    {
      id: "card",
      title: "Thẻ ngân hàng",
      description:
        "Thanh toán nhanh chóng bằng thẻ ngân hàng",
      icon: CreditCard,
    },
    {
      id: "wallet",
      title: "Ví điện tử",
      description:
        "Thanh toán tiện lợi bằng ví điện tử",
      icon: Wallet,
    },
    {
      id: "bank",
      title: "Chuyển khoản ngân hàng",
      description:
        "Chuyển khoản trực tiếp qua ngân hàng",
      icon: Building2,
    },
  ];

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
            Thanh toán
          </h1>

          <p className="mt-2 text-blue-100">
            Kiểm tra thông tin và hoàn tất thanh toán cho chuyến đi.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Progress */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
              ✓
            </div>

            <span className="mx-3 hidden text-sm font-semibold text-green-600 sm:block">
              Đặt vé
            </span>

            <div className="h-px w-10 bg-blue-600 sm:w-20" />

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              2
            </div>

            <span className="ml-3 hidden text-sm font-semibold text-blue-600 sm:block">
              Thanh toán
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Flight summary */}
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
                      Kiểm tra thông tin trước khi thanh toán
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-5">
                  <p className="text-sm text-gray-500">
                    Hãng hàng không
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-gray-900">
                    {airline}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">
                        {from}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Điểm đi
                      </p>
                    </div>

                    <Plane
                      size={20}
                      className="rotate-90 text-blue-500"
                    />

                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-gray-900">
                        {to}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Điểm đến
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDays size={16} />
                      <span className="text-sm">Ngày bay</span>
                    </div>

                    <p className="mt-2 font-bold text-gray-900">
                      {date}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Armchair size={16} />
                      <span className="text-sm">Ghế</span>
                    </div>

                    <p className="mt-2 font-bold text-blue-600">
                      {seat || "Chưa chọn"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={16} />
                      <span className="text-sm">
                        Hành trình
                      </span>
                    </div>

                    <p className="mt-2 font-bold text-gray-900">
                      {from} → {to}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotion */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Tag size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Mã giảm giá
                  </h2>

                  <p className="text-sm text-gray-500">
                    Nhập mã để nhận ưu đãi
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={promotionCode}
                  onChange={(e) =>
                    setPromotionCode(e.target.value)
                  }
                  placeholder="Nhập mã giảm giá"
                  disabled={!!appliedPromotion}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

                {!appliedPromotion ? (
                  <button
                    type="button"
                    onClick={handleApplyPromotion}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
                  >
                    Áp dụng
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRemovePromotion}
                    className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-600"
                  >
                    Bỏ mã
                  </button>
                )}
              </div>

              {promotionMessage && (
                <p
                  className={`mt-3 text-sm font-medium ${
                    appliedPromotion
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {promotionMessage}
                </p>
              )}

              {appliedPromotion && (
                <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-green-700">
                        Mã {appliedPromotion.code}
                      </p>

                      <p className="mt-1 text-sm text-green-600">
                        Đã áp dụng thành công
                      </p>
                    </div>

                    <p className="font-extrabold text-green-700">
                      -{formatPrice(discountAmount)} VNĐ
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment methods */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Phương thức thanh toán
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Chọn phương thức bạn muốn sử dụng
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const selected =
                    paymentMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(method.id)
                      }
                      className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left transition ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon size={22} />
                        </div>

                        <div>
                          <p className="font-bold text-gray-900">
                            {method.title}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                      </div>

                      {selected && (
                        <CheckCircle
                          size={22}
                          className="shrink-0 text-blue-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  Thông tin thanh toán và đặt vé của bạn được
                  xử lý an toàn trong quá trình thanh toán.
                </p>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="bg-gray-900 px-6 py-5 text-white">
                <p className="text-sm text-gray-300">
                  Tổng thanh toán
                </p>

                <p className="mt-1 text-3xl font-extrabold">
                  {formatPrice(finalPrice)} VNĐ
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-gray-900">
                  Chi tiết đơn hàng
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Giá vé
                    </span>

                    <span className="font-semibold text-gray-900">
                      {formatPrice(price)} VNĐ
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-green-600">
                        Giảm giá
                      </span>

                      <span className="font-semibold text-green-600">
                        -{formatPrice(discountAmount)} VNĐ
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Hành khách
                    </span>

                    <span className="text-right font-semibold text-gray-900">
                      {fullName || "Chưa nhập"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Ghế
                    </span>

                    <span className="font-semibold text-blue-600">
                      {seat || "Chưa chọn"}
                    </span>
                  </div>
                </div>

                <div className="my-5 border-t border-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">
                    Thành tiền
                  </span>

                  <span className="text-xl font-extrabold text-blue-600">
                    {formatPrice(finalPrice)} VNĐ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePayment}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
                >
                  Xác nhận thanh toán
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <ArrowLeft size={17} />
                  Quay lại
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Payment;