# Tiệm Cà Phê Nhóm 18 - Backend Cốt Lõi (Spring Boot)

Dự án phát triển hệ thống quản lý và bán hàng cho Tiệm Cà Phê (Đồ án cuối kỳ - XDLTW).

## 🚀 Tiến Độ Hiện Tại (Admin Features)

Dựa trên bảng phân công và chức năng quản trị viên, đây là tiến độ thực hiện:

- [x] **1. Quản lý danh mục (Category Management)**
  - Thêm, sửa, xóa (soft-delete), ẩn/hiện danh mục nguyên vật liệu.
  - Viết Unit Test tự động cho Service (Coverage 100%).
- [ ] **2. Quản lý sản phẩm (Product Management)**
  - _Đang chờ thực hiện..._
- [ ] **3. Quản lý nhập kho (Inventory Management)**
  - _Đang chờ thực hiện..._
- [ ] **4. Cấu hình vận hành (Voucher/Shipping)**
  - _Đang chờ thực hiện..._
- [ ] **5. Quản lý đơn hàng (Order Management)**
  - _Đang chờ thực hiện..._
- [ ] **6. Quản lý thống kê (Statistics)**
  - _Đang chờ thực hiện..._
- [ ] **7. Quản lý người dùng (User Management)**
  - _Đang chờ thực hiện..._

---

## 📚 API Ghi Chú: Danh Mục (Categories)

Base URL: `http://localhost:8080/api/categories`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Lấy danh sách tất cả các danh mục |
| `GET` | `/{id}` | Lấy chi tiết một danh mục theo ID |
| `POST` | `/` | Thêm mới một danh mục |
| `PUT` | `/{id}` | Cập nhật thông tin danh mục theo ID |
| `DELETE` | `/{id}` | Xóa mềm (Soft Delete - Set status = 0) |
| `PATCH`| `/{id}/toggle`| Ẩn/Hiện danh mục (Đảo ngược status 0 <-> 1) |

## 🛠 Công Nghệ Sử Dụng (Tính đến hiện tại)
- Java 21
- Spring Boot 3.2+ (Web, Data JPA)
- MySQL Database (Aivencloud)
- JUnit 5 & Mockito (Unit Testing)
- Jackson (Xử lý chuỗi JSON)