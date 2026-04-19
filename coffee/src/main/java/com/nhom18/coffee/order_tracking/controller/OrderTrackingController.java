package com.nhom18.coffee.order_tracking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.order_tracking.dto.OrderHistoryResponse;
import com.nhom18.coffee.order_tracking.service.OrderTrackingService;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*") // Chống lỗi CORS khi FE gọi API
public class OrderTrackingController {

    @Autowired
    private OrderTrackingService orderTrackingService;

    // 1. API Xem lịch sử đơn hàng của 1 user
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<OrderHistoryResponse>> getOrderHistory(@PathVariable Integer userId) {
        List<OrderHistoryResponse> history = orderTrackingService.getOrderHistory(userId);
        return ResponseEntity.ok(history);
    }

    // 2. API Hủy đơn hàng
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Integer orderId) {
        String result = orderTrackingService.cancelOrder(orderId);
        
        if (result.startsWith("Thành công")) {
            return ResponseEntity.ok(result); // Trả về HTTP 200
        } else {
            return ResponseEntity.badRequest().body(result); // Trả về HTTP 400 nếu lỗi
        }
    }

    // 3. API Hủy đơn hàng từ giao diện thanh toán cổng (Bằng orderCode)
    @PutMapping("/cancel-by-code/{orderCode}")
    public ResponseEntity<String> cancelOrderByCode(@PathVariable Long orderCode) {
        String result = orderTrackingService.cancelOrderByOrderCode(orderCode);
        
        if (result.startsWith("Thành công")) {
            return ResponseEntity.ok(result); 
        } else {
            return ResponseEntity.badRequest().body(result); 
        }
    }
}