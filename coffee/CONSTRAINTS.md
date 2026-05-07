# Hướng Dẫn Từng Bước Thêm Ràng Buộc (Constraints) Vào Dự Án

Dưới đây là các bước để thêm lại ràng buộc hợp lệ (Validation Constraints) vào mã nguồn backend.

## Bước 1: Cập nhật thư viện trong lớp DTO và Controller
Đảm bảo thư viện `spring-boot-starter-validation` đã tồn tại trong `pom.xml`. Khi thêm vào code, ta sẽ cần import các gói từ `jakarta.validation.constraints.*` vào các file DTO và `jakarta.validation.Valid` vào Controller.

## Bước 2: Bổ sung Annotation vào UserDTO
- **email**: `@NotBlank` ("Email không được để trống"), `@Email` ("Email không hợp lệ")
- **password**: `@Size(min = 6)` ("Mật khẩu phải có ít nhất 6 ký tự")
- **fullName**: `@NotBlank` ("Họ tên không được để trống")
- **phone**: `@Size(min = 10, max = 10)` ("Số điện thoại phải có đúng 10 ký tự")

## Bước 3: Bổ sung Annotation vào ProductDTO
- **name**: `@NotBlank` ("Tên sản phẩm không được để trống")
- **price**: `@NotNull` ("Giá sản phẩm không được để trống"), `@Min(value = 0)` ("Giá sản phẩm không được âm")
- **unit**: `@NotBlank` ("Đơn vị tính không được để trống (vd: 250g, 1kg)")
- **stockQuantity**: `@NotNull` ("Số lượng tồn kho không được để trống"), `@Min(value = 0)` ("Số lượng tồn kho không được âm")

## Bước 4: Bổ sung Annotation vào GoodsReceiptRequestDTO
- **adminId**: `@NotNull` ("Admin ID không được để trống")
- **details**: `@NotEmpty` ("Danh sách chi tiết nhập kho không được rỗng")

## Bước 5: Bổ sung Annotation vào GoodsReceiptDetailRequestDTO
- **productId**: `@NotNull` ("Product ID không được để trống")
- **quantityAdded**: `@NotNull` ("Số lượng nhập không được để trống"), `@Min(value = 1)` ("Số lượng nhập phải lớn hơn 0")
- **importPrice**: `@NotNull` ("Giá nhập không được để trống"), `@Min(value = 0)` ("Giá nhập không được âm")

## Bước 6: Bổ sung Annotation vào ShippingFeeDTO
- **regionName**: `@NotBlank` ("Tên khu vực không được để trống")
- **fee**: `@NotNull` ("Phí vận chuyển không được để trống"), `@Min(value = 0)` ("Phí vận chuyển không được âm")

## Bước 7: Bổ sung Annotation vào VoucherDTO
- **code**: `@NotBlank` ("Mã voucher không được để trống")
- **discountAmount**: `@NotNull` ("Số tiền giảm giá không được để trống"), `@Min(value = 1000)` ("Số tiền giảm giá phải lớn hơn hoặc bằng 1,000 VND")
- **minOrderValue**: `@NotNull` ("Giá trị đơn hàng tối thiểu không được để trống"), `@Min(value = 0)` ("Giá trị đơn hàng tối thiểu không được âm")
- **expirationDate**: `@Future` ("Ngày hết hạn phải nằm trong tương lai")

## Bước 8: Thêm `@Valid` vào các tham số nhận DTO ở tầng Controller
Vào các Controller tương ứng (VD: `UserController`, `ProductController`...) và dán `@Valid` ở trước các mảng tham số `@RequestBody DTO` để kích hoạt việc xác thực tự động.
