# TravelGo

## 1. Giới thiệu đề tài

TravelGo là website đặt vé máy bay được xây dựng bằng React và Vite,
hướng đến việc mô phỏng quy trình tìm kiếm chuyến bay, đặt vé, chọn ghế,
thanh toán và quản lý vé trên giao diện web.

Ứng dụng sử dụng Local Storage để lưu trữ dữ liệu trong phạm vi prototype,
không sử dụng backend và cơ sở dữ liệu tập trung.

## 2. Mục tiêu đề tài

### 2.1. Mục tiêu sản phẩm

- Xây dựng giao diện website đặt vé máy bay trực tuyến.
- Cho phép người dùng tìm kiếm và lọc chuyến bay.
- Cho phép người dùng xem thông tin chi tiết chuyến bay và lựa chọn ghế.
- Hỗ trợ nhập thông tin hành khách và chuyển sang bước thanh toán.
- Mô phỏng thanh toán và tạo booking sau khi thanh toán thành công.
- Cho phép người dùng xem, tìm kiếm, lọc và quản lý vé đã đặt.
- Hỗ trợ xem và quản lý thông báo.
- Cho phép người dùng đánh giá chuyến bay sau khi đã thanh toán.
- Cung cấp trang hồ sơ để cập nhật thông tin cá nhân và mật khẩu.

### 2.2. Mục tiêu kỹ thuật

- Sử dụng React để xây dựng ứng dụng frontend.
- Sử dụng React Router để tổ chức điều hướng giữa các trang.
- Sử dụng Tailwind CSS để xây dựng giao diện responsive.
- Sử dụng Local Storage để mô phỏng việc lưu trữ và chia sẻ dữ liệu.
- Tổ chức mã nguồn theo component và page để dễ bảo trì.
- Kiểm tra và xử lý các trường hợp dữ liệu Local Storage không hợp lệ.
- Tạo trải nghiệm liền mạch giữa các bước tìm kiếm, đặt vé, thanh toán
  và quản lý vé.

### 2.3. Mục tiêu quản trị

Khu vực Admin hỗ trợ mô phỏng việc quản lý dữ liệu của hệ thống,
bao gồm:

- Quản lý chuyến bay.
- Quản lý ghế.
- Quản lý booking.
- Quản lý người dùng.
- Quản lý mã khuyến mại.
- Quản lý đánh giá.
- Theo dõi doanh thu.
- Quản lý thông báo.

## 3. Phạm vi đề tài

Đề tài tập trung vào frontend React của TravelGo. Các chức năng được
triển khai ở mức prototype và sử dụng dữ liệu cục bộ trong trình duyệt.

Các chức năng chính gồm:

- Trang chủ.
- Đăng ký và đăng nhập.
- Tìm kiếm chuyến bay.
- Chi tiết chuyến bay.
- Đặt vé và chọn ghế.
- Thanh toán.
- Vé điện tử.
- Quản lý vé.
- Thông báo.
- Đánh giá chuyến bay.
- Bản đồ chỉ đường.
- Hồ sơ cá nhân.
- Khu vực quản trị Admin.

## 4. Công nghệ sử dụng

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- JavaScript
- Local Storage

## 5. Chạy dự án

## Phạm vi thực hiện

TravelGo tập trung xây dựng frontend React cho website đặt vé máy bay.
Các chức năng chính gồm:

- Đăng ký và đăng nhập tài khoản.
- Tìm kiếm, lọc và sắp xếp chuyến bay.
- Xem chi tiết chuyến bay.
- Chọn ghế và đặt vé.
- Thanh toán mô phỏng.
- Quản lý vé đã đặt.
- Quản lý thông báo.
- Đánh giá chuyến bay.
- Quản lý thông tin cá nhân.
- Khu vực quản trị Admin.

## Giới hạn của đề tài

- Chưa triển khai backend và cơ sở dữ liệu tập trung.
- Dữ liệu được lưu trữ bằng Local Storage của trình duyệt.
- Thanh toán hiện tại chỉ là mô phỏng, chưa kết nối cổng thanh toán thật.
- Xác thực và phân quyền mới được xử lý ở phía frontend.
- Bản đồ chỉ mô phỏng và hỗ trợ mở Google Maps.
- Chưa có cơ chế đồng bộ dữ liệu giữa nhiều thiết bị.
- Một số chức năng Admin phục vụ mục đích demo và kiểm thử.

```bash
npm install
npm run dev