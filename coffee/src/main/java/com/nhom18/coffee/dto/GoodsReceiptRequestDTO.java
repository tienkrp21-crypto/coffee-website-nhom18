package com.nhom18.coffee.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class GoodsReceiptRequestDTO {

    @NotNull(message = "Admin ID không được để trống")
    private Integer adminId;

    private String note;

    @NotEmpty(message = "Danh sách chi tiết nhập kho không được rỗng")
    private List<GoodsReceiptDetailRequestDTO> details;

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public List<GoodsReceiptDetailRequestDTO> getDetails() {
        return details;
    }

    public void setDetails(List<GoodsReceiptDetailRequestDTO> details) {
        this.details = details;
    }
}
