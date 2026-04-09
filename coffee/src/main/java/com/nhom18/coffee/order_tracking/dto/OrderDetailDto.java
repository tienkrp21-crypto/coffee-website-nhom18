package com.nhom18.coffee.order_tracking.dto;

public class OrderDetailDto {
    private Integer productId;
    private String productName;
    private String imageUrl; // Gửi luôn hình ảnh để FE làm giao diện lịch sử cho đẹp
    private Integer quantity;
    private Integer price; // Giá lúc mua

    // --- GETTER & SETTER ---
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }
}