package com.nhom18.coffee.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ShippingFeeDTO {

    private Integer id;

    @NotBlank(message = "Tên khu vực không được để trống")
    private String regionName;

    @NotNull(message = "Phí vận chuyển không được để trống")
    @Min(value = 0, message = "Phí vận chuyển không được âm")
    private Integer fee;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public Integer getFee() {
        return fee;
    }

    public void setFee(Integer fee) {
        this.fee = fee;
    }
}
