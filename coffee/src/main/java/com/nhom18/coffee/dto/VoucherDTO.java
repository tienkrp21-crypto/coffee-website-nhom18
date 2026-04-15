package com.nhom18.coffee.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VoucherDTO {

    private Integer id;

    @NotBlank(message = "Mã voucher không được để trống")
    private String code;

    @NotNull(message = "Số tiền giảm giá không được để trống")
    @Min(value = 1000, message = "Số tiền giảm giá phải lớn hơn hoặc bằng 1,000 VND")
    private Integer discountAmount;

    @NotNull(message = "Giá trị đơn hàng tối thiểu không được để trống")
    @Min(value = 0, message = "Giá trị đơn hàng tối thiểu không được âm")
    private Integer minOrderValue;

    @Future(message = "Ngày hết hạn phải nằm trong tương lai")
    private LocalDateTime expirationDate;

    private Integer status; // Sẽ được hệ thống tự set (thường mặc định là 1 khi tạo)

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Integer discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Integer getMinOrderValue() {
        return minOrderValue;
    }

    public void setMinOrderValue(Integer minOrderValue) {
        this.minOrderValue = minOrderValue;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}