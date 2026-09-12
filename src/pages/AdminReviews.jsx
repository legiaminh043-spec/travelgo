import { useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  Search,
  Star,
  Trash2,
  MessageSquare,
  User,
  Plane,
  Calendar,
} from "lucide-react";

function AdminReviews() {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("travelgoReviews");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Không thể đọc đánh giá:", error);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("Tất cả");

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (search.trim()) {
      const keyword = search.toLowerCase().trim();

      result = result.filter((review) => {
        return (
          (review.fullName || "")
            .toLowerCase()
            .includes(keyword) ||
          (review.airline || "")
            .toLowerCase()
            .includes(keyword) ||
          (review.flightCode || "")
            .toLowerCase()
            .includes(keyword) ||
          (review.ticketCode || "")
            .toLowerCase()
            .includes(keyword) ||
          (review.comment || "")
            .toLowerCase()
            .includes(keyword)
        );
      });
    }

    if (ratingFilter !== "Tất cả") {
      result = result.filter(
        (review) =>
          Number(review.rating) === Number(ratingFilter)
      );
    }

    return result;
  }, [reviews, search, ratingFilter]);

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (total, review) =>
            total + Number(review.rating || 0),
          0
        ) / totalReviews
      : 0;

  const fiveStarReviews = reviews.filter(
    (review) => Number(review.rating) === 5
  ).length;

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa đánh giá này không?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedReviews = reviews.filter(
      (review) => review.id !== id
    );

    setReviews(updatedReviews);

    localStorage.setItem(
      "travelgoReviews",
      JSON.stringify(updatedReviews)
    );
  };

  const clearFilter = () => {
    setSearch("");
    setRatingFilter("Tất cả");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý đánh giá
          </h1>

          <p className="mt-2 text-gray-500">
            Xem và quản lý đánh giá của khách hàng về chuyến bay.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Tổng đánh giá
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {totalReviews}
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <MessageSquare size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Điểm trung bình
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-3xl font-bold text-yellow-500">
                    {averageRating.toFixed(1)}
                  </p>

                  <Star
                    size={25}
                    className="fill-yellow-400 text-yellow-400"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
                <Star size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Đánh giá 5 sao
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {fiveStarReviews}
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <Star size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, mã vé, hãng bay, mã chuyến..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="Tất cả">
                Tất cả đánh giá
              </option>

              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>

            <button
              type="button"
              onClick={clearFilter}
              className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50"
            >
              Xóa lọc
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Danh sách đánh giá
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Hiển thị {filteredReviews.length} /{" "}
              {reviews.length} đánh giá
            </p>
          </div>

          {filteredReviews.length > 0 ? (
            <div className="divide-y">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex flex-col justify-between gap-5 lg:flex-row">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                            <User size={18} />
                          </div>

                          <span className="font-bold text-gray-900">
                            {review.fullName ||
                              "Khách hàng"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={17}
                              className={
                                star <=
                                Number(review.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-gray-500 md:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <Plane size={16} />

                          <span>
                            {review.airline || "Không rõ"}{" "}
                            {review.flightCode
                              ? `- ${review.flightCode}`
                              : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar size={16} />

                          <span>
                            {review.date || "Không rõ"}
                          </span>
                        </div>

                        <div>
                          Mã vé:{" "}
                          <span className="font-semibold text-blue-600">
                            {review.ticketCode || "Không rõ"}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 leading-7 text-gray-700">
                        {review.comment ||
                          "Khách hàng không để lại nhận xét."}
                      </p>

                      <p className="mt-3 text-xs text-gray-400">
                        {review.createdAt || "Không rõ thời gian"}
                      </p>
                    </div>

                    <div className="flex items-start">
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(review.id)
                        }
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <MessageSquare
                size={50}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-xl font-bold text-gray-700">
                Chưa có đánh giá
              </h3>

              <p className="mt-2 text-gray-500">
                Chưa có đánh giá nào phù hợp với điều kiện tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;