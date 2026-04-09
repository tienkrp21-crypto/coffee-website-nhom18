# Tiệm Cà Phê Nhóm 18 - Backend Cốt Lõi (Spring Boot)

Dự án phát triển hệ thống quản lý và bán hàng cho Tiệm Cà Phê (Đồ án cuối kỳ - XDLTW).

## 🚀 Tiến Độ Hiện Tại (Admin & Client Features)

Dựa trên bảng phân công, đây là tiến độ thực hiện:

- [x] **1. Quản lý danh mục (Category Management)**
  - Thêm, sửa, xóa (soft-delete), ẩn/hiện danh mục nguyên vật liệu.
  - Viết Unit Test tự động cho Service (Coverage 100%).
- [x] **2. Quản lý sản phẩm (Product Management)**
  - Thêm, sửa, xóa (soft-delete), lấy chi tiết và phân trang sản phẩm theo danh mục.
  - Áp dụng cấu trúc chuẩn Controller -> Service -> Repository với DTO.
- [x] **3. Quản lý người dùng (User Management)**
  - Đăng ký và đăng nhập tài khoản.
  - CRUD User quản lý tài khoản với UserDTO.
- [x] **4. Quản lý giỏ hàng (Cart Management - Mới chuẩn hóa)**
  - Cơ chế thêm (Add / Tự động cộng dồn số lượng).
  - Cập nhật số lượng (Update / tự xóa nếu số lượng <= 0).
  - Tính tổng tiền (Total).
- [ ] **5. Quản lý nhập kho (Inventory Management)**
  - _Đang chờ thực hiện..._
- [ ] **6. Cấu hình vận hành (Voucher/Shipping)**
  - _Đang chờ thực hiện..._
- [ ] **7. Quản lý đơn hàng (Order Management)**
  - _Đang chờ thực hiện..._
- [ ] **8. Quản lý thống kê (Statistics)**
  - _Đang chờ thực hiện..._

---

## 🏗 Luồng Hoạt Động (Data Flow) Đã Chuẩn Hóa Toàn Diện

Kiến trúc mã nguồn API đã được thiết kế lại chặt chẽ theo chuẩn 3-layer Spring Boot:

1. **Client Request:** Gửi HTTP request (Postman, Frontend Client,...).
2. **Controller (API Endpoints):** 
   - Đón nhận Request và Parameter.
   - Thêm Validation bằng Annotation `@Valid`.
   - **Tất cả kết quả được bọc lại trong `ApiResponse<T>` với format chuẩn mực:**
     `{ "success": true/false, "message": "...", "data": ... }`
3. **Global Exception Handler & Validation:** 
   - Nếu Controller bắt gặp lỗi, ngoại lệ không gây sập Server (Lỗi 500) mà được Handler bọc lại thành Response 400 Bad Request hoặc 404 Không Tồn Tại.
4. **Service (`Interface` & `Impl`):** 
   - Xử lý Business Logic trung tâm. Tương tác với CSDL qua Repository.
5. **Repository (Data Data JPA):** 
   - Interface `JpaRepository` mapping trực tiếp Entity, truy vấn CSDL MySQL.
6. **Entity:** 
   - Đại diện chính xác 1-1 Table dưới Database.

---

## 📚 API Ghi Chú Cơ Bản & Mới Cập Nhật

Hệ thống cung cấp Endpoint tiêu chuẩn RESTful (Đủ GET/POST/PUT/DELETE):

- **`/api/categories`**: Quản lý thông tin Danh mục (Admin).
- **`/api/products` và `/api/products/client/search`**: Quản lý Sản phẩm (Admin + Phân trang Client).
- **`/api/users`**: Quản lý Người Dùng & Auth (Đăng nhập, đăng ký).
- **`/api/cart`**: Quản lý Giỏ hàng của Client.

## 🛠 Công Nghệ Sử Dụng
- Java 21
- Spring Boot 3.2+ (Web, Data JPA)
- MySQL Database (Aivencloud)
- JUnit 5 & Mockito (Unit Testing)
- Jackson (Xử lý chuỗi JSON)
- **Cấu trúc chuẩn DTO và ApiResponse Handling.**
