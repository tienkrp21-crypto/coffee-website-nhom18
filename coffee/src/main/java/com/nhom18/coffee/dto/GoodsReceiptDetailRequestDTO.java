package com.nhom18.coffee.dto;

public class GoodsReceiptDetailRequestDTO {

    private Integer productId;

    private Integer quantityAdded;

    private Integer importPrice;

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getQuantityAdded() {
        return quantityAdded;
    }

    public void setQuantityAdded(Integer quantityAdded) {
        this.quantityAdded = quantityAdded;
    }

    public Integer getImportPrice() {
        return importPrice;
    }

    public void setImportPrice(Integer importPrice) {
        this.importPrice = importPrice;
    }
}
