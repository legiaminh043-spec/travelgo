function Footer() {
  return (
    <footer className="bg-gray-900 py-14 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white">
              T
            </div>

            <h2 className="text-2xl font-extrabold text-white">
              TravelGo
            </h2>
          </div>

          <p className="mt-4 leading-7 text-gray-400">
            Nền tảng hỗ trợ tìm kiếm và đặt dịch vụ du lịch
            trực tuyến nhanh chóng, thuận tiện và an toàn.
          </p>
        </div>

        {/* Dịch vụ */}
        <div>
          <h3 className="text-lg font-bold text-white">
            Dịch vụ
          </h3>

          <ul className="mt-5 space-y-3">
            <li>
              <a
                href="#services"
                className="transition hover:text-white"
              >
                Chuyến bay
              </a>
            </li>

            <li>
              <a
                href="#services"
                className="transition hover:text-white"
              >
                Khách sạn
              </a>
            </li>

            <li>
              <a
                href="#services"
                className="transition hover:text-white"
              >
                Đưa đón sân bay
              </a>
            </li>

            <li>
              <a
                href="#destinations"
                className="transition hover:text-white"
              >
                Điểm đến
              </a>
            </li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="text-lg font-bold text-white">
            Hỗ trợ
          </h3>

          <ul className="mt-5 space-y-3">
            <li>
              <a
                href="#"
                className="transition hover:text-white"
              >
                Trung tâm trợ giúp
              </a>
            </li>

            <li>
              <a
                href="#"
                className="transition hover:text-white"
              >
                Chính sách
              </a>
            </li>

            <li>
              <a
                href="#"
                className="transition hover:text-white"
              >
                Điều khoản sử dụng
              </a>
            </li>

            <li>
              <a
                href="#"
                className="transition hover:text-white"
              >
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-lg font-bold text-white">
            Liên hệ
          </h3>

          <div className="mt-5 space-y-3">
            <p>
              Hà Nội, Việt Nam
            </p>

            <p>
              Hotline: 1900 1234
            </p>

            <a
              href="mailto:support@travelgo.vn"
              className="block transition hover:text-white"
            >
              support@travelgo.vn
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-gray-800 px-4 pt-6 text-center text-sm text-gray-500 sm:px-6">
        © 2026 TravelGo. Đồ án kỳ - Ngành Công nghệ Thông tin.
      </div>
    </footer>
  );
}

export default Footer;