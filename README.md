# ⚽ Website Thương Mại Điện Tử Đồ Bóng Đá

## 📝 Mô tả

Đây là một nền tảng thương mại điện tử chuyên cung cấp các sản phẩm thể thao, đặc biệt là **đồ bóng đá** như áo đấu, giày, bóng, phụ kiện,... Hệ thống cho phép người dùng đăng ký, đăng nhập, duyệt sản phẩm, thêm vào giỏ hàng, thanh toán và theo dõi đơn hàng. Quản trị viên có thể quản lý sản phẩm, đơn hàng và người dùng.

---

## 🎯 2. Mục tiêu đề tài

### Mục tiêu tổng thể

Xây dựng một hệ thống thương mại điện tử trực tuyến chuyên cung cấp sản phẩm đồ bóng đá, phục vụ cả người dùng cá nhân lẫn quản trị viên quản lý cửa hàng.

### Mục tiêu cụ thể

- Cho phép người dùng đăng ký tài khoản, đăng nhập, chỉnh sửa thông tin cá nhân.
- Hiển thị danh sách sản phẩm, tìm kiếm, lọc sản phẩm theo danh mục.
- Cho phép người dùng thêm sản phẩm vào giỏ hàng, thanh toán online.
- Quản lý đơn hàng, theo dõi trạng thái xử lý đơn hàng.
- Trang quản trị cho phép quản lý sản phẩm, đơn hàng, người dùng.
- Tích hợp bảo mật JWT, phân quyền truy cập.
- Giao diện thân thiện, dễ sử dụng trên cả desktop và thiết bị di động.

---

## 👥 3. Đối tượng và phạm vi nghiên cứu

### a. Đối tượng nghiên cứu

- Người dùng có nhu cầu mua sắm đồ thể thao, đặc biệt là đồ bóng đá.
- Quản trị viên hệ thống cần quản lý sản phẩm và đơn hàng.
- Nền tảng web thương mại điện tử có tích hợp thanh toán và quản lý người dùng.

### b. Phạm vi nghiên cứu

- Xây dựng hệ thống web bao gồm **frontend** và **backend**.
- Tập trung triển khai nền tảng web, **chưa phát triển phiên bản mobile app**.
- Sử dụng công nghệ:
  - **Backend**: Node.js + Express.js
  - **Frontend**: ReactJS
  - **Cơ sở dữ liệu**: MongoDB
- Chức năng thanh toán sử dụng Stripe hoặc PayPal.
- Xác thực người dùng bằng JWT, phân quyền theo vai trò.

---

## 🛠️ Công nghệ sử dụng

- **Backend**: Node.js (Express.js)
- **Frontend**: ReactJS
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Thanh toán**: Stripe / PayPal
- **Giao tiếp**: RESTful API

---

## ⚙️ Hướng dẫn cài đặt và chạy chương trình

### 1. Clone repository

```bash
git clone https://github.com/yourusername/football-ecommerce-website.git
cd football-ecommerce-website
