
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Users,
  ShieldCheck,
  User,
  Trash2,
  Mail,
  X,
} from "lucide-react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const savedUsers = JSON.parse(
      localStorage.getItem("travelgoUsers") || "[]"
    );

    const currentUser = JSON.parse(
      localStorage.getItem("travelgoUser") || "null"
    );

    let userList = savedUsers;

    if (userList.length === 0 && currentUser) {
      userList = [currentUser];
    }

    setUsers(userList);
  }, []);

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase().trim();

    const matchesSearch =
      user.fullName?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword);

    const matchesRole =
      roleFilter === "Tất cả" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const totalNormalUsers = users.filter(
    (user) => user.role !== "admin"
  ).length;

  const handleDelete = (email) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa người dùng này không?"
    );

    if (!confirmed) return;

    const updatedUsers = users.filter(
      (user) => user.email !== email
    );

    setUsers(updatedUsers);

    localStorage.setItem(
      "travelgoUsers",
      JSON.stringify(updatedUsers)
    );

    if (selectedUser?.email === email) {
      setSelectedUser(null);
    }
  };

  const getRoleName = (role) => {
    return role === "admin" ? "Admin" : "Người dùng";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              TravelGo Admin
            </h1>

            <p className="text-sm text-gray-500">
              Quản lý người dùng
            </p>
          </div>

          <Link
            to="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Quay lại Admin
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Tổng người dùng
                </p>

                <p className="text-3xl font-bold mt-2">
                  {totalUsers}
                </p>
              </div>

              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Admin
                </p>

                <p className="text-3xl font-bold mt-2">
                  {totalAdmins}
                </p>
              </div>

              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Người dùng
                </p>

                <p className="text-3xl font-bold mt-2">
                  {totalNormalUsers}
                </p>
              </div>

              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <User size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">
                Danh sách người dùng
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Quản lý tài khoản User và Admin
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm tên hoặc email..."
                  className="w-full md:w-72 pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 border rounded-lg outline-none"
              >
                <option value="Tất cả">
                  Tất cả
                </option>

                <option value="admin">
                  Admin
                </option>

                <option value="user">
                  Người dùng
                </option>
              </select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <Users
                size={48}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-500 mt-4">
                Không tìm thấy người dùng nào.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="py-4 px-3">
                      Người dùng
                    </th>

                    <th className="py-4 px-3">
                      Email
                    </th>

                    <th className="py-4 px-3">
                      Vai trò
                    </th>

                    <th className="py-4 px-3">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.email}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {user.fullName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <div>
                            <p className="font-semibold">
                              {user.fullName || "Chưa có tên"}
                            </p>

                            <p className="text-sm text-gray-500">
                              Tài khoản TravelGo
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />

                          {user.email}
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck size={15} />
                          ) : (
                            <User size={15} />
                          )}

                          {getRoleName(user.role)}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
                          >
                            Chi tiết
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(user.email)
                            }
                            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5 text-sm text-gray-500">
            Hiển thị {filteredUsers.length} / {totalUsers} người dùng
          </div>
        </div>
      </main>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="text-xl font-bold">
                  Chi tiết tài khoản
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Thông tin người dùng
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold">
                  {selectedUser.fullName
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <h4 className="text-xl font-bold mt-3">
                  {selectedUser.fullName || "Chưa có tên"}
                </h4>

                <span
                  className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedUser.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {getRoleName(selectedUser.role)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Họ và tên
                  </p>

                  <p className="font-medium mt-1">
                    {selectedUser.fullName || "Chưa có"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-medium mt-1">
                    {selectedUser.email || "Chưa có"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Vai trò
                  </p>

                  <p className="font-medium mt-1">
                    {getRoleName(selectedUser.role)}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
