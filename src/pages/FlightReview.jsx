
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plane,
  Star,
  ArrowLeft,
  CheckCircle,
  User,
  MessageSquare,
} from "lucide-react";

function FlightReview() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const ticketCode = searchParams.get("ticketCode") || "";

  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const currentUser = (() => {
    try {
      const savedUser = localStorage.getItem("travelgoUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Không thể đọc tài khoản hiện tại:", error);
      return null;
    }
  })();

  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("travelgoBookings");

      if (!savedBookings) {
        setError("Không tìm thấy thông tin đặt vé.");
        return;
      }

      const parsedBookings = JSON.parse(savedBookings);

      if (!Array.isArray(parsedBookings)) {
        setError("Dữ liệu đặt vé không hợp lệ.");
        return;
      }

      const foundBooking = parsedBookings.find(
        (item) => item.ticketCode === ticketCode
      );

      if (!foundBooking) {
        setError("Không tìm thấy vé cần đánh giá.");
        return;
      }

      if (foundBooking.status !== "Đã thanh toán") {
        setError(
          "Bạn chỉ có thể đánh giá sau khi vé được thanh toán."
        );
        return;
      }

      if (!currentUser?.email) {
        setError("Vui lòng đăng nhập để đánh giá vé.");
        return;
      }

      const bookingEmail = String(foundBooking.email || "")
        .trim()
        .toLowerCase();
      const userEmail = String(currentUser.email || "")
        .trim()
        .toLowerCase();

      if (!bookingEmail || bookingEmail !== userEmail) {
        setError("Bạn không có quyền đánh giá vé này.");
        return;
      }

      setBooking(foundBooking);

      const savedReviews = localStorage.getItem(
        "travelgoReviews"
      );

      if (savedReviews) {
        const reviews = JSON.parse(savedReviews);

        if (Array.isArray(reviews)) {
          const existingReview = reviews.find(
            (review) => review.ticketCode === ticketCode
          );

          if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || "");
            setSubmitted(true);
          }
        }
      }
    } catch (err) {
      console.error("Không thể đọc dữ liệu đánh giá:", err);
      setError("Không thể tải thông tin đánh giá.");
    }
  }, [ticketCode, currentUser?.email]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!booking) {
      return;
    }

    if (rating === 0) {
      setError("Vui lòng chọn số sao đánh giá.");
      return;
    }

    if (!comment.trim()) {
      setError("Vui lòng nhập nhận xét.");
      return;
    }

    try {
      const savedReviews = localStorage.getItem(
        "travelgoReviews"
      );

      const reviews = savedReviews
        ? JSON.parse(savedReviews)
        : [];

      const newReview = {
        id: Date.now(),
        ticketCode: booking.ticketCode,
        flightId: booking.flightId,
        flightCode: booking.flightCode || "",
        airline: booking.airline,
        from: booking.from,
        to: booking.to,
        date: booking.date,
        fullName: booking.fullName,
        email: booking.email,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toLocaleString("vi-VN"),
      };

      const existingIndex = reviews.findIndex(
        (review) => review.ticketCode === booking.ticketCode
      );

      if (existingIndex !== -1) {
        reviews[existingIndex] = {
          ...reviews[existingIndex],
          ...newReview,
        };
      } else {
        reviews.unshift(newReview);
      }

      localStorage.setItem(
        "travelgoReviews",
        JSON.stringify(reviews)
      );

      setSubmitted(true);
      setError("");
    } catch (err) {
      console.error("Không thể lưu đánh giá:", err);
      setError("Không thể lưu đánh giá. Vui lòng thử lại.");
    }
  };

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <MessageSquare size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Không thể đánh giá
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/my-bookings")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Xem vé của tôi
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Đang tải thông tin chuyến bay...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-12 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <button
            type="button"
            onClick={() => navigate("/my-bookings")}
            className="mb-5 flex items-center gap-2 text-blue-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Quay lại vé của tôi
          </button>

          <h1 className="text-3xl font-bold">
            Đánh giá & nhận xét chuyến bay
          </h1>

          <p className="mt-2 text-blue-100">
            Chia sẻ trải nghiệm của bạn với TravelGo
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="rounded-2xl bg-blue-50 p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-600 p-3 text-white">
                  <Plane size={28} />
                </div>

                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {booking.airline}
                  </p>

                  {booking.flightCode && (
                    <p className="mt-1 font-medium text-blue-600">
                      {booking.flightCode}
                    </p>
                  )}

                  <p className="mt-2 text-gray-600">
                    {booking.from} → {booking.to}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-gray-500">
                  Mã vé
                </p>

                <p className="font-bold text-gray-900">
                  {booking.ticketCode}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-blue-100 pt-5 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">
                  Ngày bay
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {booking.date || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Hành khách
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {booking.fullName || "Khách hàng"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Trạng thái
                </p>
                <p className="mt-1 font-semibold text-green-600">
                  {booking.status}
                </p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle size={34} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-green-800">
                Đánh giá thành công!
              </h2>

              <p className="mt-2 text-green-700">
                Cảm ơn bạn đã chia sẻ trải nghiệm với TravelGo.
              </p>

              <div className="mt-5 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              <p className="mt-4 text-gray-600">
                {comment}
              </p>

              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Quay lại vé của tôi
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Star className="text-yellow-500" />
                  <h2 className="text-xl font-bold">
                    Bạn đánh giá chuyến bay này thế nào?
                  </h2>
                </div>

                <p className="mt-2 text-gray-500">
                  Chọn từ 1 đến 5 sao
                </p>

                <div className="mt-5 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                      onClick={() => {
                        setRating(star);
                        setError("");
                      }}
                      className="rounded-lg p-1 transition hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={
                          star <=
                          (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>

                <p className="mt-3 font-semibold text-gray-700">
                  {rating === 0
                    ? "Chưa đánh giá"
                    : `${rating}/5 sao`}
                </p>
              </div>

              <div className="mt-8">
                <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                  <User size={17} />
                  Nhận xét của bạn
                </label>

                <textarea
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setError("");
                  }}
                  rows={6}
                  placeholder="Hãy chia sẻ trải nghiệm của bạn về chuyến bay..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse justify-between gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/my-bookings")}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlightReview;

