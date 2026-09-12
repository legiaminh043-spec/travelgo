import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = localStorage.getItem("travelgoUser");

    if (!savedUser) {
      alert("Chưa có tài khoản. Vui lòng đăng ký!");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem("travelgoUser");
      alert("Dữ liệu tài khoản bị lỗi. Vui lòng đăng ký lại!");
      return;
    }

    if (email.trim() === user.email && password === user.password) {
      localStorage.setItem("travelgoLoggedIn", "true");

      alert("Đăng nhập thành công!");

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      alert("Email hoặc mật khẩu không đúng!");
    }
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
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 outline-none"
              />

              <Eye size={20} className="text-gray-400" />
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Ghi nhớ tôi
            </label>

            <button
              type="button"
              className="text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </button>
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