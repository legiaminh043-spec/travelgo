
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plane,
  MapPin,
  Calendar,
  Clock,
  Armchair,
  ArrowLeft,
  ShieldCheck,
  Star,
  MessageSquare,
} from "lucide-react";

function FlightDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const flightId = searchParams.get("flightId") || "";
  const airline = searchParams.get("airline") || "";
  const flightCode = searchParams.get("flightCode") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const price = Number(searchParams.get("price") || 0);
  const totalSeats = Number(
    searchParams.get("totalSeats") || 180
  );
  const availableSeats = Number(
    searchParams.get("availableSeats") || 0
  );

  const isSoldOut = availableSeats <= 0;

  const reviews = useMemo(() => {
    try {
      const savedReviews = localStorage.getItem(
        "travelgoReviews"
      );

      if (!savedReviews) {
        return [];
      }

      const parsedReviews = JSON.parse(savedReviews);

      if (!Array.isArray(parsedReviews)) {
        return [];
      }

      return parsedReviews.filter((review) => {
        const sameFlightId =
          String(review.flightId || "") ===
          String(flightId);

        const sameFlightCode =
          flightCode &&
          review.flightCode &&
          String(review.flightCode) ===
            String(flightCode);

        const sameAirline =
          review.airline &&
          normalizeText(review.airline) ===
            normalizeText(airline);

        const sameRoute =
          review.from &&
          review.to &&
          normalizeText(review.from) ===
            normalizeText(from) &&
          normalizeText(review.to) ===
            normalizeText(to);

        return (
          sameFlightId ||
          sameFlightCode ||
          sameAirline && sameRoute
        );
      });
    } catch (error) {
      console.error(
        "Không thể đọc đánh giá chuyến bay:",
        error
      );

      return [];
    }
  }, [flightId, flightCode, airline, from, to]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total + Number(review.rating || 0),
          0
        ) / reviews.length
      : 0;

  const ratingCounts = {
    5: reviews.filter(
      (review) => Number(review.rating) === 5
    ).length,
    4: reviews.filter(
      (review) => Number(review.rating) === 4
    ).length,
    3: reviews.filter(
      (review) => Number(review.rating) === 3
    ).length,
    2: reviews.filter(
      (review) => Number(review.rating) === 2
    ).length,
    1: reviews.filter(
      (review) => Number(review.rating) === 1
    ).length,
  };

  const handleBooking = () => {
    if (isSoldOut) {
      return;
    }

    const bookingUrl =
      "/booking" +
      "?flightId=" +
      encodeURIComponent(flightId) +
      "&airline=" +
      encodeURIComponent(airline) +
      "&from=" +
      encodeURIComponent(from) +
      "&to=" +
      encodeURIComponent(to) +
      "&date=" +
      encodeURIComponent(date) +
      "&price=" +
      encodeURIComponent(price);

    navigate(bookingUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 py-12 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-blue-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Quay lại kết quả
          </button>

          <h1 className="text-3xl font-bold">
            Chi tiết chuyến bay
          </h1>

          <p className="mt-2 text-blue-100">
            Xem thông tin trước khi đặt vé
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b bg-gradient-to-r from-blue-50 to-white p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-blue-600 p-4 text-white">
                  <Plane size={32} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {airline || "Chuyến bay"}
                  </h2>

                  <p className="mt-1 font-medium text-blue-600">
                    {flightCode || "Mã chuyến chưa có"}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-gray-500">
                  Giá vé
                </p>

                <p className="text-3xl font-bold text-blue-600">
                  {price.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="rounded-2xl border border-gray-200 p-6">
              <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Hành trình
              </p>

              <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                <div className="w-full text-center md:w-auto md:text-left">
                  <p className="text-sm text-gray-500">
                    Điểm đi
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {from}
                  </p>
                </div>

                <div className="flex min-w-[160px] items-center gap-3 text-blue-600">
                  <div className="h-px flex-1 bg-blue-200" />

                  <Plane size={22} />

                  <div className="h-px flex-1 bg-blue-200" />
                </div>

                <div className="w-full text-center md:w-auto md:text-right">
                  <p className="text-sm text-gray-500">
                    Điểm đến
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {to}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-600" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Ngày bay
                    </p>

                    <p className="font-bold text-gray-900">
                      {date || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-600" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Giờ khởi hành
                    </p>

                    <p className="font-bold text-gray-900">
                      {time || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex items-center gap-3">
                  <Armchair className="text-blue-600" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Ghế còn lại
                    </p>

                    <p
                      className={`font-bold ${
                        isSoldOut
                          ? "text-red-600"
                          : availableSeats <= 20
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {availableSeats}/{totalSeats}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 text-green-600" />

                <div>
                  <p className="font-bold text-green-800">
                    Đặt vé an toàn
                  </p>

                  <p className="mt-1 text-sm text-green-700">
                    Thông tin hành khách và thanh toán được
                    thực hiện trực tiếp trong hệ thống TravelGo.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t pt-8">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-blue-600" />

                <h2 className="text-2xl font-bold text-gray-900">
                  Đánh giá & nhận xét
                </h2>
              </div>

              {reviews.length > 0 ? (
                <>
                  <div className="mt-6 grid gap-6 rounded-2xl bg-gray-50 p-6 md:grid-cols-[220px_1fr]">
                    <div className="text-center md:border-r md:pr-6">
                      <p className="text-5xl font-black text-gray-900">
                        {averageRating.toFixed(1)}
                      </p>

                      <div className="mt-3 flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={22}
                            className={
                              star <=
                              Math.round(averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      <p className="mt-3 text-sm text-gray-500">
                        {reviews.length} lượt đánh giá
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star];

                        const percentage =
                          reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0;

                        return (
                          <div
                            key={star}
                            className="flex items-center gap-3"
                          >
                            <div className="flex w-10 items-center gap-1 text-sm font-semibold">
                              {star}
                              <Star
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                              />
                            </div>

                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-yellow-400"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>

                            <span className="w-8 text-right text-sm text-gray-500">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={
                          review.id ||
                          `${review.ticketCode}-${review.createdAt}`
                        }
                        className="rounded-2xl border border-gray-200 p-5"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <p className="font-bold text-gray-900">
                              {review.fullName ||
                                "Khách hàng"}
                            </p>

                            <div className="mt-1 flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <Star
                                    key={star}
                                    size={16}
                                    className={
                                      star <=
                                      Number(
                                        review.rating || 0
                                      )
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                )
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-400">
                            {review.createdAt ||
                              "Không rõ thời gian"}
                          </p>
                        </div>

                        <p className="mt-4 leading-7 text-gray-700">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                  <MessageSquare
                    size={40}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="mt-4 font-bold text-gray-700">
                    Chưa có đánh giá
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Chuyến bay này chưa có nhận xét từ hành khách.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t pt-8 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Quay lại
              </button>

              <button
                type="button"
                onClick={handleBooking}
                disabled={isSoldOut}
                className={`rounded-xl px-8 py-3 font-semibold text-white ${
                  isSoldOut
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSoldOut
                  ? "Chuyến bay đã hết chỗ"
                  : "Đặt chuyến bay này"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default FlightDetail;

