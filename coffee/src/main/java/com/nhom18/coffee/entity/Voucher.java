package com.nhom18.coffee.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vouchers")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Mã voucher phải là DUY NHẤT (unique = true) và KHÔNG ĐƯỢC TRỐNG
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    // Trừ số tiền cố định (VD: 20000)
    @Column(name = "discount_amount", nullable = false)
    private Integer discountAmount;

    // Điều kiện áp dụng (VD: Đơn trên 100k mới được dùng)
    @Column(name = "min_order_value", nullable = false)
    private Integer minOrderValue;

    // Thời gian hết hạn
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

    // 1: Hoạt động, 0: Khóa
    @Column(columnDefinition = "TINYINT DEFAULT 1")
    private Integer status;

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