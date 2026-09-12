import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  ArrowLeft,
  Lock,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [avatar, setAvatar] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("travelgoUser");

      if (!savedUser) {
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);
      setFullName(parsedUser.fullName || "");
      setEmail(parsedUser.email || "");
      setPhone(parsedUser.phone || "");
      setAvatar(parsedUser.avatar || "");
    } catch (error) {
      console.error(
        "Không thể đọc thông tin tài khoản:",
        error
      );

      navigate("/login");
    }
  }, [navigate]);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showMessage("Vui lòng chọn file ảnh.", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage("Ảnh không được lớn hơn 2MB.", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
      setMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleSaveInfo = (event) => {
    event.preventDefault();

    if (!fullName.trim()) {
      showMessage("Vui lòng nhập họ và tên.", "error");
      return;
    }

    if (!email.trim()) {
      showMessage("Vui lòng nhập email.", "error");
      return;
    }

    const updatedUser = {
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar,
    };

    localStorage.setItem(
      "travelgoUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    showMessage("Cập nhật thông tin thành công!", "success");
  };

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (!oldPassword) {
      showMessage("Vui lòng nhập mật khẩu hiện tại.", "error");
      return;
    }

    if (!newPassword) {
      showMessage("Vui lòng nhập mật khẩu mới.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showMessage(
        "Mật khẩu mới phải có ít nhất 6 ký tự.",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage(
        "Mật khẩu xác nhận không khớp.",
        "error"
      );
      return;
    }

    if (String(user.password || "") !== oldPassword) {
      showMessage(
        "Mật khẩu hiện tại không đúng.",
        "error"
      );
      return;
    }

    const updatedUser = {
      ...user,
      password: newPassword,
    };

    localStorage.setItem(
      "travelgoUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

    showMessage(
      "Đổi mật khẩu thành công!",
      "success"
    );
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Đang tải thông tin tài khoản...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="bg-blue-600 px-8 py-10 text-white">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-4 ring-white/30">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>

                <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-blue-600 shadow-md hover:bg-gray-100">
                  <Camera size={17} />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Hồ sơ cá nhân
                </h1>

                <p className="mt-1 text-blue-100">
                  Quản lý thông tin tài khoản TravelGo
                </p>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`mx-8 mt-6 rounded-xl px-4 py-3 text-sm font-semibold ${
                messageType === "success"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid gap-8 p-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Thông tin tài khoản
              </h2>

              <form
                onSubmit={handleSaveInfo}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Họ và tên
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setMessage("");
                      }}
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setMessage("");
                      }}
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Số điện thoại
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setMessage("");
                      }}
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Vai trò
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <ShieldCheck
                      size={20}
                      className="text-blue-600"
                    />

                    <span className="font-semibold text-gray-700">
                      {user.role === "admin"
                        ? "Quản trị viên"
                        : "Người dùng"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  <Save size={18} />
                  Lưu thông tin
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Đổi mật khẩu
              </h2>

              <form
                onSubmit={handleChangePassword}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Mật khẩu hiện tại
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={
                        showOldPassword
                          ? "text"
                          : "password"
                      }
                      value={oldPassword}
                      onChange={(e) =>
                        setOldPassword(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none focus:border-blue-500"
                      placeholder="Nhập mật khẩu hiện tại"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowOldPassword(
                          !showOldPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Mật khẩu mới
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none focus:border-blue-500"
                      placeholder="Nhập mật khẩu mới"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Xác nhận mật khẩu mới
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none focus:border-blue-500"
                      placeholder="Nhập lại mật khẩu mới"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-black"
                >
                  <Lock size={18} />
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;