# Tiệm Cà Phê Nhóm 18 - Backend Cốt Lõi (Spring Boot)

Dự án phát triển hệ thống quản lý và bán hàng cho Tiệm Cà Phê (Đồ án cuối kỳ - XDLTW).

## 🚀 Tiến Độ Hiện Tại (Admin Features)

Dựa trên bảng phân công và chức năng quản trị viên, đây là tiến độ thực hiện:

- [x] **1. Quản lý danh mục (Category Management)**
  - Thêm, sửa, xóa (soft-delete), ẩn/hiện danh mục nguyên vật liệu.
  - Viết Unit Test tự động cho Service (Coverage 100%).
- [x] **2. Quản lý sản phẩm (Product Management)**
  - Thêm, sửa, xóa (soft-delete), lấy chi tiết và phân trang sản phẩm theo danh mục.
  - Áp dụng cấu trúc chuẩn Controller -> Service -> Repository với DTO.
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

## 🏗 Luồng Hoạt Động (Data Flow)

Kiến trúc mã nguồn API tuân theo chuẩn 3-layer của Spring Boot. Luồng dữ liệu đi qua các tầng như sau:

1. **Client Request:** Gửi HTTP request (Postman, Frontend Client,...).
2. **Controller:** Nhận HTTP Request và gửi các parameter / body payload xuống Service dưới dạng `DTO` (Ví dụ: `ProductDTO`).
3. **Service (`Interface` & `Impl`):** Nhận `DTO`, thực thi logic nghiệp vụ (kiểm tra điều kiện, map dữ liệu...). Service sử dụng `Repository` để tương tác với CSDL. Nó sẽ convert giữa `DTO` và `Entity`.
4. **Repository:** Interface kế thừa từ `JpaRepository`. Chịu trách nhiệm truy vấn trực tiếp Entity xuống dòng dữ liệu (Database MySQL).
5. **Entity:** Đối tượng Java biểu diễn chính xác cấu trúc của Table Database MySQL (Dùng Annotation `@Table`, `@Column`, ...).

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

## 📚 API Ghi Chú: Sản Phẩm (Products - Admin)

Base URL: `http://localhost:8080/api/products`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `?page=0&size=10&keyword=&categoryId=` | Lấy danh sách sản phẩm (có phân trang, search, lọc) |
| `GET` | `/{id}` | Lấy chi tiết sản phẩm theo ID |
| `POST` | `/` | Thêm mới một sản phẩm (Có kiểm tra Validation) |
| `PUT` | `/{id}` | Cập nhật thông tin sản phẩm |
| `DELETE` | `/{id}` | Xóa mềm sản phẩm theo ID |

_Ghi chú: Có hỗ trợ tìm kiếm cho client tại `/client/search`_

## 📚 API Ghi Chú: Người Dùng (Users)

Base URL: `http://localhost:8080/users`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Đăng ký tài khoản người dùng mới |
| `POST` | `/login` | Đăng nhập tài khoản |

## 🛠 Công Nghệ Sử Dụng (Tính đến hiện tại)
- Java 21
- Spring Boot 3.2+ (Web, Data JPA)
- MySQL Database (Aivencloud)
- JUnit 5 & Mockito (Unit Testing)
- Jackson (Xử lý chuỗi JSON)