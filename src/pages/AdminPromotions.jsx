import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Tag,
  X,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const defaultPromotions = [
  {
    id: 1,
    code: "WELCOME10",
    description: "Giảm giá cho khách hàng mới",
    type: "percent",
    value: 10,
    minPrice: 500000,
    maxUses: 100,
    used: 12,
    status: "Đang hoạt động",
  },
  {
    id: 2,
    code: "TRAVEL50K",
    description: "Giảm 50.000đ cho đơn từ 1 triệu",
    type: "fixed",
    value: 50000,
    minPrice: 1000000,
    maxUses: 50,
    used: 8,
    status: "Đang hoạt động",
  },
];

const emptyPromotion = {
  code: "",
  description: "",
  type: "percent",
  value: "",
  minPrice: "",
  maxUses: "",
};

function AdminPromotions() {
  const [promotions, setPromotions] = useState(() => {
    try {
      const saved = localStorage.getItem("travelgoPromotions");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Không thể đọc mã giảm giá:", error);
    }

    return defaultPromotions;
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState(emptyPromotion);

  useEffect(() => {
    localStorage.setItem(
      "travelgoPromotions",
      JSON.stringify(promotions)
    );
  }, [promotions]);

  const filteredPromotions = promotions.filter((promotion) => {
    const keyword = search.toLowerCase().trim();

    return (
      promotion.code.toLowerCase().includes(keyword) ||
      promotion.description.toLowerCase().includes(keyword)
    );
  });

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " ₫";
  };

  const formatDiscount = (promotion) => {
    if (promotion.type === "percent") {
      return `${promotion.value}%`;
    }

    return formatPrice(promotion.value);
  };

  const openAddForm = () => {
    setEditingPromotion(null);
    setFormData(emptyPromotion);
    setShowForm(true);
  };

  const openEditForm = (promotion) => {
    setEditingPromotion(promotion);

    setFormData({
      code: promotion.code,
      description: promotion.description,
      type: promotion.type,
      value: promotion.value,
      minPrice: promotion.minPrice,
      maxUses: promotion.maxUses,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPromotion(null);
    setFormData(emptyPromotion);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.code.trim() ||
      !formData.description.trim() ||
      !formData.value ||
      !formData.minPrice ||
      !formData.maxUses
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const value = Number(formData.value);
    const minPrice = Number(formData.minPrice);
    const maxUses = Number(formData.maxUses);

    if (value <= 0 || minPrice < 0 || maxUses <= 0) {
      alert("Giá trị nhập không hợp lệ!");
      return;
    }

    if (formData.type === "percent" && value > 100) {
      alert("Phần trăm giảm giá không được vượt quá 100%!");
      return;
    }

    const code = formData.code.trim().toUpperCase();

    if (!editingPromotion) {
      const codeExists = promotions.some(
        (promotion) => promotion.code === code
      );

      if (codeExists) {
        alert("Mã giảm giá đã tồn tại!");
        return;
      }

      const newPromotion = {
        id: Date.now(),
        code,
        description: formData.description.trim(),
        type: formData.type,
        value,
        minPrice,
        maxUses,
        used: 0,
        status: "Đang hoạt động",
      };

      setPromotions((prev) => [...prev, newPromotion]);

      alert("Thêm mã giảm giá thành công!");
    } else {
      setPromotions((prev) =>
        prev.map((promotion) =>
          promotion.id === editingPromotion.id
            ? {
                ...promotion,
                code,
                description: formData.description.trim(),
                type: formData.type,
                value,
                minPrice,
                maxUses,
              }
            : promotion
        )
      );

      alert("Cập nhật mã giảm giá thành công!");
    }

    closeForm();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa mã giảm giá này?"
    );

    if (!confirmed) {
      return;
    }

    setPromotions((prev) =>
      prev.filter((promotion) => promotion.id !== id)
    );
  };

  const toggleStatus = (id) => {
    setPromotions((prev) =>
      prev.map((promotion) =>
        promotion.id === id
          ? {
              ...promotion,
              status:
                promotion.status === "Đang hoạt động"
                  ? "Tạm dừng"
                  : "Đang hoạt động",
            }
          : promotion
      )
    );
  };

  const activeCount = promotions.filter(
    (promotion) => promotion.status === "Đang hoạt động"
  ).length;

  const pausedCount = promotions.filter(
    (promotion) => promotion.status === "Tạm dừng"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý mã giảm giá
            </h1>

            <p className="mt-2 text-gray-500">
              Quản lý các chương trình khuyến mãi của TravelGo
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />
            Thêm mã giảm giá
          </button>
        </div>

        {/* Thống kê */}
        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Tag size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Tổng mã giảm giá
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {promotions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <Tag size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Đang hoạt động
                </p>

                <p className="mt-1 text-2xl font-bold text-green-600">
                  {activeCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <Tag size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Tạm dừng
                </p>

                <p className="mt-1 text-2xl font-bold text-orange-600">
                  {pausedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tìm kiếm */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 rounded-lg border px-4">
            <Search size={20} className="text-gray-400" />

            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3 outline-none"
            />
          </div>
        </div>

        {/* Danh sách */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-4">Mã</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4">Giảm giá</th>
                  <th className="px-6 py-4">Đơn tối thiểu</th>
                  <th className="px-6 py-4">Sử dụng</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredPromotions.map((promotion) => (
                  <tr
                    key={promotion.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-blue-100 px-3 py-2 font-bold text-blue-700">
                        {promotion.code}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {promotion.description}
                    </td>

                    <td className="px-6 py-5 font-bold text-green-600">
                      {formatDiscount(promotion)}
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {formatPrice(promotion.minPrice)}
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-gray-700">
                        {promotion.used} / {promotion.maxUses}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() => toggleStatus(promotion.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          promotion.status === "Đang hoạt động"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {promotion.status}
                      </button>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(promotion)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(promotion.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPromotions.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không tìm thấy mã giảm giá
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingPromotion
                    ? "Chỉnh sửa mã giảm giá"
                    : "Thêm mã giảm giá"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Nhập thông tin chương trình khuyến mãi
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mã giảm giá
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="VD: WELCOME10"
                  className="w-full rounded-lg border px-4 py-3 uppercase outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mô tả
                </label>

                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả mã giảm giá"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Loại giảm
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="percent">
                      Phần trăm (%)
                    </option>

                    <option value="fixed">
                      Số tiền (₫)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Giá trị giảm
                  </label>

                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    min="1"
                    placeholder={
                      formData.type === "percent"
                        ? "10"
                        : "50000"
                    }
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Đơn tối thiểu
                  </label>

                  <input
                    type="number"
                    name="minPrice"
                    value={formData.minPrice}
                    onChange={handleChange}
                    min="0"
                    placeholder="500000"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Số lượt sử dụng
                  </label>

                  <input
                    type="number"
                    name="maxUses"
                    value={formData.maxUses}
                    onChange={handleChange}
                    min="1"
                    placeholder="100"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border px-5 py-3 font-medium text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {editingPromotion ? "Lưu thay đổi" : "Thêm mã"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPromotions;