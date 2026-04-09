package com.nhom18.coffee.dto;

public class OrderDetailDTO {
    private Integer id;
    private Integer productId;
    private String productName;
    private String productImageUrl;
    private Integer quantity;
    private Integer priceAtPurchase;
    private Integer subTotal;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getPriceAtPurchase() { return priceAtPurchase; }
    public void setPriceAtPurchase(Integer priceAtPurchase) { this.priceAtPurchase = priceAtPurchase; }

    public Integer getSubTotal() { return subTotal; }
    public void setSubTotal(Integer subTotal) { this.subTotal = subTotal; }
}