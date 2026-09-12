import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const savedUsers = localStorage.getItem("travelgoUsers");
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      if (Array.isArray(users)) {
        const user = users.find(
          (item) =>
            String(item.email || "").trim().toLowerCase() ===
              normalizedEmail &&
            String(item.password || "") === password
        );

        if (user) {
          localStorage.setItem(
            "travelgoUser",
            JSON.stringify(user)
          );
          localStorage.setItem("travelgoLoggedIn", "true");

          navigate(user.role === "admin" ? "/admin" : "/", {
            replace: true,
          });
          return;
        }
      }
    } catch (error) {
      console.error("Lỗi đọc danh sách tài khoản:", error);
    }

    // Backward compatibility with older data that only stored one user.
    const savedUser = localStorage.getItem("travelgoUser");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        if (
          String(user.email || "").trim().toLowerCase() ===
            normalizedEmail &&
          String(user.password || "") === password
        ) {
          localStorage.setItem("travelgoLoggedIn", "true");
          navigate(user.role === "admin" ? "/admin" : "/", {
            replace: true,
          });
          return;
        }
      } catch (error) {
        localStorage.removeItem("travelgoUser");
      }
    }

    alert("Email hoặc mật khẩu không đúng!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            TravelGo
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Đăng nhập
          </h2>

          <p className="mt-2 text-gray-500">
            Chào mừng bạn quay trở lại!
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <div className="flex items-center rounded-lg border px-3">
              <Mail size={20} className="text-gray-400" />

              <input
                type="email"
                required
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">
              Mật khẩu
            </label>

            <div className="flex items-center rounded-lg border px-3">
              <Lock size={20} className="text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
