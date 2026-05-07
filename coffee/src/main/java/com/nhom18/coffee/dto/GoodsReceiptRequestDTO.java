package com.nhom18.coffee.dto;

import java.util.List;

public class GoodsReceiptRequestDTO {

    private Integer adminId;

    private String note;

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
