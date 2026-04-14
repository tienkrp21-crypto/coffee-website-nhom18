package com.nhom18.coffee.QLUser;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "role_id")
    private Integer roleId; // Khóa ngoại trỏ đến bảng roles

    private String email;
    private String password;

    @Column(name = "full_name")
    private String fullName; // Map với cột full_name trong database

    private String phone;

    private Integer status;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;
    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "otp_expiry")
    private Timestamp otpExpiry;

    // --- NHỚ DÁN THÊM GETTER & SETTER CHO 2 BIẾN NÀY XUỐNG DƯỚI CÙNG NHÉ ---
    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
    public Timestamp getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(Timestamp otpExpiry) { this.otpExpiry = otpExpiry; }

    // --- GETTER & SETTER ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getRoleId() { return roleId; }
    public void setRoleId(Integer roleId) { this.roleId = roleId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}