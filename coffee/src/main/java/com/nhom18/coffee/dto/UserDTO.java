package com.nhom18.coffee.dto;

import java.sql.Timestamp;

public class UserDTO {

    private Integer id;

    private Integer roleId;
    
    private String email;

    private String password;

    private String fullName;
    
    private String phone;

    private Integer status;

    private Timestamp createdAt;

    // Controllers
    public UserDTO() {}

    public UserDTO(Integer id, Integer roleId, String email, String password, String fullName, String phone, Integer status, Timestamp createdAt) {
        this.id = id;
        this.roleId = roleId;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
