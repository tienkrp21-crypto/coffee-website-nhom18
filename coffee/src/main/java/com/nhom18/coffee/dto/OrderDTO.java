package com.nhom18.coffee.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Integer id;
    private Integer userId;
    private String customerName; // Lấy từ User nếu có
    private Integer totalAmount;
    private Integer shippingFee;
    private Integer discountAmount;
    private Integer finalAmount;
    private String paymentMethod;
    private Boolean paymentStatus;
    private String orderStatus;
    private String shippingAddress;
    private String receiverName;
    private String receiverPhone;
    private LocalDateTime createdAt;
    
    private List<OrderDetailDTO> orderDetails;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Integer getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Integer totalAmount) { this.totalAmount = totalAmount; }

    public Integer getShippingFee() { return shippingFee; }
    public void setShippingFee(Integer shippingFee) { this.shippingFee = shippingFee; }

    public Integer getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Integer discountAmount) { this.discountAmount = discountAmount; }

    public Integer getFinalAmount() { return finalAmount; }
    public void setFinalAmount(Integer finalAmount) { this.finalAmount = finalAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Boolean getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(Boolean paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderDetailDTO> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetailDTO> orderDetails) { this.orderDetails = orderDetails; }
}