package com.nhom18.coffee.service;

import org.springframework.data.domain.Page;

import com.nhom18.coffee.dto.OrderDTO;

public interface OrderService {
    // Lấy danh sách đơn hàng cho Admin, có thể lọc theo trạng thái
    Page<OrderDTO> getAllOrders(int page, int size, String orderStatus);

    // Xem chi tiết đơn hàng
    OrderDTO getOrderById(Integer id);

    // Thay đổi trạng thái đơn hàng (PENDING, CANCELLED, etc)
    OrderDTO updateOrderStatus(Integer id, String newStatus);
}