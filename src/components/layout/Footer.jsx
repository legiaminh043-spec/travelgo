function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">

        <div>
          <h2 className="text-2xl font-bold text-white">
            TravelGo
          </h2>

          <p className="mt-4">
            Nền tảng hỗ trợ tìm kiếm và đặt dịch vụ du lịch trực tuyến.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white">
            Dịch vụ
          </h3>

          <ul className="mt-4 space-y-2">
            <li>Chuyến bay</li>
            <li>Khách sạn</li>
            <li>Đưa đón sân bay</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">
            Hỗ trợ
          </h3>

          <ul className="mt-4 space-y-2">
            <li>Trung tâm trợ giúp</li>
            <li>Chính sách</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">
            Liên hệ
          </h3>

          <p className="mt-4">
            Hà Nội, Việt Nam
          </p>

          <p className="mt-2">
            Email: support@travelgo.vn
          </p>
        </div>

      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-700 px-6 pt-6 text-center text-sm">
        © 2026 TravelGo. Đồ án kỳ - Ngành Công nghệ Thông tin.
      </div>
    </footer>
  );
}

export default Footer;