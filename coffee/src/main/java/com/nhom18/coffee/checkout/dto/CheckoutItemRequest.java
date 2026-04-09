package com.nhom18.coffee.checkout.dto;

public class CheckoutItemRequest {
    private Integer productId;
    private Integer quantity;

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}