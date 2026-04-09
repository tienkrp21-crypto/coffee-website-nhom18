package com.nhom18.coffee.checkout.dto;

public class CheckoutResponse {
    private Integer orderId;
    private String message;
    private String paymentUrl; // Chỉ dùng khi chọn thanh toán VNPAY

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getPaymentUrl() { return paymentUrl; }
    public void setPaymentUrl(String paymentUrl) { this.paymentUrl = paymentUrl; }
}