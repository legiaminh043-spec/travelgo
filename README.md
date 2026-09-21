# TravelGo

TravelGo là ứng dụng frontend mô phỏng nền tảng đặt vé máy bay trực tuyến.
Hệ thống hỗ trợ tìm kiếm chuyến bay, đặt vé, chọn ghế, thanh toán mô phỏng,
quản lý vé, thông báo, đánh giá, hồ sơ người dùng và khu vực quản trị.

## Công nghệ sử dụng

| Công nghệ | Vai trò |
|---|---|
| React 19 | Xây dựng giao diện và các component |
| Vite 8 | Công cụ phát triển, build và HMR |
| Tailwind CSS 4 | Thiết kế giao diện và responsive |
| React Router DOM 7 | Định tuyến giữa các trang |
| lucide-react | Cung cấp hệ thống icon cho giao diện |
| JavaScript / JSX | Ngôn ngữ triển khai frontend |
| localStorage | Lưu trữ dữ liệu mô phỏng phía trình duyệt |
| Git / GitHub | Quản lý phiên bản mã nguồn |

## Các chức năng chính

### Người dùng

- Đăng ký và đăng nhập
- Tìm kiếm chuyến bay
- Lọc và sắp xếp chuyến bay
- Xem chi tiết chuyến bay
- Chọn ghế
- Đặt vé
- Thanh toán mô phỏng
- Áp dụng mã khuyến mại
- Xem và quản lý vé
- Hủy vé
- Xem thông báo
- Đánh giá chuyến bay
- Xem hướng dẫn bản đồ
- Cập nhật hồ sơ
- Đổi mật khẩu

### Quản trị viên

- Dashboard
- Quản lý chuyến bay
- Quản lý ghế
- Quản lý booking
- Quản lý người dùng
- Quản lý khuyến mại
- Quản lý đánh giá
- Thống kê doanh thu
- Quản lý thông báo

## Kiến trúc frontend

Project được xây dựng theo mô hình SPA frontend.

```text
src/
├── assets/
├── components/
├── context/
├── pages/
│   ├── Auth/
│   └── Admin/
├── App.jsx
├── main.jsx
├── App.css
└── index.cssgit add README.md