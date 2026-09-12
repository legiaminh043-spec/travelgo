import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";

const initialFlights = [
  {
    id: 1,
    airline: "Vietnam Airlines",
    flightCode: "VN123",
    from: "Hà Nội",
    to: "TP. Hồ Chí Minh",
    date: "10/09/2026",
    time: "08:00",
    price: 1200000,
    totalSeats: 180,
    availableSeats: 180,
    status: "Đang mở bán",
  },
  {
    id: 2,
    airline: "Vietjet Air",
    flightCode: "VJ456",
    from: "Hà Nội",
    to: "Đà Nẵng",
    date: "11/09/2026",
    time: "10:30",
    price: 850000,
    totalSeats: 180,
    availableSeats: 180,
    status: "Đang mở bán",
  },
  {
    id: 3,
    airline: "Bamboo Airways",
    flightCode: "QH789",
    from: "TP. Hồ Chí Minh",
    to: "Hà Nội",
    date: "12/09/2026",
    time: "14:00",
    price: 1350000,
    totalSeats: 180,
    availableSeats: 180,
    status: "Sắp bay",
  },
  {
    id: 4,
    airline: "Vietnam Airlines",
    flightCode: "VN555",
    from: "Đà Nẵng",
    to: "Hà Nội",
    date: "13/09/2026",
    time: "16:30",
    price: 1050000,
    totalSeats: 180,
    availableSeats: 180,
    status: "Đang mở bán",
  },
];

const statusOptions = [
  "Đang mở bán",
  "Sắp bay",
  "Đã bay",
  "Đã hủy",
];

function getAutomaticStatus(flight) {
  if (flight.status === "Đã hủy") {
    return "Đã hủy";
  }

  if (!flight.date) {
    return flight.status || "Đang mở bán";
  }

  const dateText = String(flight.date).trim();
  const timeText = String(flight.time || "00:00").trim();

  let day;
  let month;
  let year;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateText)) {
    [day, month, year] = dateText.split("/");
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    [year, month, day] = dateText.split("-");
  } else {
    return flight.status || "Đang mở bán";
  }

  const [hour = "0", minute = "0"] = timeText.split(":");

  const flightDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );

  if (Number.isNaN(flightDate.getTime())) {
    return flight.status || "Đang mở bán";
  }

  const now = new Date();
  const diff = flightDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "Đã bay";
  }

  const hoursLeft = diff / (1000 * 60 * 60);

  if (hoursLeft <= 24) {
    return "Sắp bay";
  }

  return "Đang mở bán";
}

function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);

  const [formData, setFormData] = useState({
    airline: "",
    flightCode: "",
    from: "",
    to: "",
    date: "",
    time: "",
    price: "",
    totalSeats: 180,
    availableSeats: 180,
    status: "Đang mở bán",
  });

  useEffect(() => {
    try {
      const savedFlights =
        localStorage.getItem("travelgoFlights");

      if (savedFlights) {
        const parsedFlights = JSON.parse(savedFlights);

        if (
          Array.isArray(parsedFlights) &&
          parsedFlights.length > 0
        ) {
          const updatedFlights = parsedFlights.map((flight) => ({
            ...flight,
            status: getAutomaticStatus(flight),
          }));

          setFlights(updatedFlights);

          localStorage.setItem(
            "travelgoFlights",
            JSON.stringify(updatedFlights)
          );

          return;
        }
      }
    } catch (error) {
      console.error("Lỗi đọc dữ liệu:", error);
    }

    const updatedInitialFlights = initialFlights.map(
      (flight) => ({
        ...flight,
        status: getAutomaticStatus(flight),
      })
    );

    setFlights(updatedInitialFlights);

    localStorage.setItem(
      "travelgoFlights",
      JSON.stringify(updatedInitialFlights)
    );
  }, []);

  const saveFlights = (newFlights) => {
    const updatedFlights = newFlights.map((flight) => ({
      ...flight,
      status: getAutomaticStatus(flight),
    }));

    setFlights(updatedFlights);

    localStorage.setItem(
      "travelgoFlights",
      JSON.stringify(updatedFlights)
    );
  };

  const openAddModal = () => {
    setEditingFlight(null);

    setFormData({
      airline: "",
      flightCode: "",
      from: "",
      to: "",
      date: "",
      time: "",
      price: "",
      totalSeats: 180,
      availableSeats: 180,
      status: "Đang mở bán",
    });

    setShowModal(true);
  };

  const openEditModal = (flight) => {
    setEditingFlight(flight);

    setFormData({
      airline: flight.airline || "",
      flightCode: flight.flightCode || "",
      from: flight.from || "",
      to: flight.to || "",
      date: flight.date || "",
      time: flight.time || "",
      price: flight.price || "",
      totalSeats: flight.totalSeats || 180,
      availableSeats:
        flight.availableSeats ??
        flight.totalSeats ??
        180,
      status: flight.status || "Đang mở bán",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFlight(null);
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
      !formData.airline ||
      !formData.flightCode ||
      !formData.from ||
      !formData.to ||
      !formData.date ||
      !formData.time
    ) {
      alert("Vui lòng nhập đầy đủ thông tin chuyến bay.");
      return;
    }

    const flightData = {
      id: editingFlight
        ? editingFlight.id
        : Date.now(),
      airline: formData.airline,
      flightCode: formData.flightCode,
      from: formData.from,
      to: formData.to,
      date: formData.date,
      time: formData.time,
      price: Number(formData.price || 0),
      totalSeats: Number(formData.totalSeats || 180),
      availableSeats: Number(
        formData.availableSeats || 0
      ),
      status: formData.status,
    };

    if (editingFlight) {
      const updatedFlights = flights.map((flight) =>
        flight.id === editingFlight.id
          ? flightData
          : flight
      );

      saveFlights(updatedFlights);
    } else {
      saveFlights([flightData, ...flights]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa chuyến bay này?"
    );

    if (!confirmed) {
      return;
    }

    const updatedFlights = flights.filter(
      (flight) => flight.id !== id
    );

    saveFlights(updatedFlights);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang mở bán":
        return "bg-green-100 text-green-700";

      case "Sắp bay":
        return "bg-yellow-100 text-yellow-700";

      case "Đã bay":
        return "bg-gray-100 text-gray-700";

      case "Đã hủy":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      !search ||
      String(flight.flightCode || "")
        .toLowerCase()
        .includes(keyword) ||
      String(flight.airline || "")
        .toLowerCase()
        .includes(keyword) ||
      String(flight.from || "")
        .toLowerCase()
        .includes(keyword) ||
      String(flight.to || "")
        .toLowerCase()
        .includes(keyword);

    const matchStatus =
      statusFilter === "all" ||
      flight.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const countOpen = flights.filter(
    (flight) => flight.status === "Đang mở bán"
  ).length;

  const countUpcoming = flights.filter(
    (flight) => flight.status === "Sắp bay"
  ).length;

  const countFlown = flights.filter(
    (flight) => flight.status === "Đã bay"
  ).length;

  const countCancelled = flights.filter(
    (flight) => flight.status === "Đã hủy"
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý chuyến bay
            </h1>

            <p className="mt-1 text-gray-500">
              Thêm, sửa, xóa và cập nhật trạng thái chuyến bay
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={20} />
            Thêm chuyến bay
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Đang mở bán
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {countOpen}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Sắp bay
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {countUpcoming}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Đã bay
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-600">
              {countFlown}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Đã hủy
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {countCancelled}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã chuyến, hãng bay, điểm đi..."
              className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-lg border px-4 py-3 outline-none"
          >
            <option value="all">
              Tất cả trạng thái
            </option>

            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                <th className="px-5 py-4">
                  Mã chuyến
                </th>

                <th className="px-5 py-4">
                  Hãng bay
                </th>

                <th className="px-5 py-4">
                  Hành trình
                </th>

                <th className="px-5 py-4">
                  Ngày
                </th>

                <th className="px-5 py-4">
                  Giờ
                </th>

                <th className="px-5 py-4">
                  Giá
                </th>

                <th className="px-5 py-4">
                  Ghế
                </th>

                <th className="px-5 py-4">
                  Trạng thái
                </th>

                <th className="px-5 py-4">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredFlights.map((flight) => (
                <tr
                  key={flight.id}
                  className="border-b last:border-0"
                >
                  <td className="px-5 py-4 font-bold text-blue-600">
                    {flight.flightCode}
                  </td>

                  <td className="px-5 py-4">
                    {flight.airline}
                  </td>

                  <td className="px-5 py-4">
                    {flight.from} → {flight.to}
                  </td>

                  <td className="px-5 py-4">
                    {flight.date}
                  </td>

                  <td className="px-5 py-4">
                    {flight.time}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {Number(
                      flight.price || 0
                    ).toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </td>

                  <td className="px-5 py-4">
                    {flight.availableSeats}/
                    {flight.totalSeats}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        flight.status
                      )}`}
                    >
                      {flight.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openEditModal(flight)
                        }
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(flight.id)
                        }
                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredFlights.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              Không có chuyến bay nào.
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
              <div className="flex items-center justify-between border-b p-6">
                <h2 className="text-xl font-bold">
                  {editingFlight
                    ? "Chỉnh sửa chuyến bay"
                    : "Thêm chuyến bay"}
                </h2>

                <button
                  onClick={closeModal}
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid gap-5 p-6 md:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block font-semibold">
                    Hãng bay
                  </label>

                  <input
                    name="airline"
                    value={formData.airline}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Mã chuyến bay
                  </label>

                  <input
                    name="flightCode"
                    value={formData.flightCode}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Điểm đi
                  </label>

                  <input
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Điểm đến
                  </label>

                  <input
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Ngày bay
                  </label>

                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                    placeholder="10/09/2026"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Giờ bay
                  </label>

                  <input
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                    placeholder="08:00"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Giá vé
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Tổng số ghế
                  </label>

                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Ghế còn lại
                  </label>

                  <input
                    type="number"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibolsdd">
                    Trạng thái
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 md:col-span-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border px-5 py-3 font-semibold"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    {editingFlight
                      ? "Lưu thay đổi"
                      : "Thêm chuyến bay"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminFlights;