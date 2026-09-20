# TravelGo

TravelGo là website đặt vé máy bay được xây dựng bằng React và Vite,
tập trung mô phỏng một quy trình đặt vé trực tuyến từ tìm kiếm chuyến bay
đến thanh toán và quản lý vé.

## 1. Xác định bài toán

Trong thực tế, người dùng có nhu cầu tìm kiếm chuyến bay theo điểm đi,
điểm đến và ngày khởi hành nhưng phải thực hiện qua nhiều bước và nhiều
nguồn thông tin khác nhau.

Bài toán của TravelGo là xây dựng một giao diện web giúp người dùng thực hiện
các thao tác chính trong một quy trình đặt vé tập trung:

- Tìm kiếm chuyến bay.
- Lọc và sắp xếp chuyến bay.
- Xem chi tiết chuyến bay.
- Chọn ghế.
- Nhập thông tin hành khách.
- Thanh toán.
- Nhận thông tin vé điện tử.
- Xem và quản lý các vé đã đặt.
- Nhận thông báo liên quan đến giao dịch.
- Đánh giá chuyến bay.
- Quản lý thông tin tài khoản.

Bên cạnh khu vực người dùng, TravelGo có khu vực quản trị để mô phỏng việc
quản lý dữ liệu chuyến bay, ghế, booking, người dùng, khuyến mại, đánh giá,
doanh thu và thông báo.

## 2. Mục tiêu của đề tài

### Mục tiêu sản phẩm

Xây dựng một prototype frontend có luồng đặt vé tương đối hoàn chỉnh,
cho phép người dùng thao tác trực tiếp trên giao diện và quan sát kết quả
sau từng bước.

### Mục tiêu kỹ thuật

- Sử dụng React để xây dựng giao diện theo component.
- Sử dụng React Router để điều hướng giữa các màn hình.
- Sử dụng Tailwind CSS để xây dựng giao diện responsive.
- Sử dụng Local Storage để mô phỏng lớp dữ liệu của ứng dụng.
- Kiểm tra và xử lý các trường hợp dữ liệu không hợp lệ.
- Duy trì sự liên kết dữ liệu giữa các bước đặt vé, thanh toán, quản lý vé
  và thông báo.

## 3. Đối tượng sử dụng

### Người dùng

Người dùng có thể:

- Đăng ký và đăng nhập.
- Tìm kiếm chuyến bay.
- Lọc và sắp xếp kết quả.
- Chọn ghế và đặt vé.
- Thanh toán.
- Xem vé đã đặt.
- Hủy vé.
- Xem thông báo.
- Đánh giá chuyến bay.
- Cập nhật hồ sơ cá nhân.
- Đổi mật khẩu.
- Xem hướng dẫn chỉ đường.

### Quản trị viên

Quản trị viên có thể truy cập khu vực Admin để:

- Theo dõi tổng quan hệ thống.
- Quản lý chuyến bay.
- Quản lý ghế.
- Quản lý booking.
- Quản lý người dùng.
- Quản lý khuyến mại.
- Quản lý đánh giá.
- Theo dõi doanh thu.
- Quản lý thông báo.

## 4. Phạm vi thực hiện

TravelGo tập trung vào frontend React.

Các chức năng được triển khai dưới dạng các page và component trong thư mục
`src`, sử dụng React Router để điều hướng và Local Storage để mô phỏng
việc lưu trữ dữ liệu.

Các màn hình chính gồm:

- Home
- Login
- Register
- SearchResults
- FlightDetail
- Booking
- Payment
- BookingSuccess
- MyBookings
- Notifications
- FlightReview
- MapGuide
- Profile
- Admin

## 5. Giới hạn

Phiên bản hiện tại là prototype frontend nên:

- Chưa có backend và cơ sở dữ liệu tập trung.
- Dữ liệu được lưu bằng Local Storage trên trình duyệt.
- Thanh toán mới ở mức mô phỏng.
- Xác thực và phân quyền mới được mô phỏng phía frontend.
- Bản đồ sử dụng giao diện mô phỏng và liên kết Google Maps.
- Chưa có khả năng đồng bộ dữ liệu giữa nhiều thiết bị.

## 6. Công nghệ sử dụng

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- JavaScript
- Local Storage

## 7. Mục tiêu phát triển tiếp theo

Trong các phiên bản tiếp theo, hệ thống có thể được mở rộng bằng:

- Backend và cơ sở dữ liệu thực tế.
- API quản lý chuyến bay và booking.
- Xác thực người dùng phía server.
- Kết nối cổng thanh toán thực tế.
- Đồng bộ dữ liệu giữa nhiều thiết bị.
- Hoàn thiện hệ thống đa ngôn ngữ.
- Nâng cao bảo mật và khả năng mở rộng.