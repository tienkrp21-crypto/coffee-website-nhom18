package com.nhom18.coffee.order_tracking.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderHistoryResponse {
    private Integer orderId;
    private Integer totalAmount;
    private Integer finalAmount;
    private String paymentMethod;
    private Integer paymentStatus;
    private String orderStatus;
    private LocalDateTime createdAt;
    
    // Chứa luôn danh sách các món bên trong đơn hàng
    private List<OrderDetailDto> items;

    // --- GETTER & SETTER ---
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public Integer getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Integer totalAmount) { this.totalAmount = totalAmount; }

    public Integer getFinalAmount() { return finalAmount; }
    public void setFinalAmount(Integer finalAmount) { this.finalAmount = finalAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Integer getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(Integer paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderDetailDto> getItems() { return items; }
    public void setItems(List<OrderDetailDto> items) { this.items = items; }
}