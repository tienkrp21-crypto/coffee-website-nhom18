package com.nhom18.coffee.order_tracking.service;

import java.util.List;

import com.nhom18.coffee.order_tracking.dto.OrderHistoryResponse;

public interface OrderTrackingService {
    // 1. Lấy toàn bộ lịch sử mua hàng của 1 User
    List<OrderHistoryResponse> getOrderHistory(Integer userId);
    
    // 2. Hủy đơn và trả lại hàng vào kho
    String cancelOrder(Integer orderId);
}