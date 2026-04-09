package com.nhom18.coffee.checkout.service;

import com.nhom18.coffee.checkout.dto.CheckoutRequest;
import com.nhom18.coffee.checkout.model.Order;

public interface CheckoutService {
    Order createOrder(CheckoutRequest request);
    void updateOrderStatus(Integer orderId, Integer paymentStatus, String orderStatus);
    void restoreStock(Integer orderId); // Khôi phục kho nếu hủy đơn
}