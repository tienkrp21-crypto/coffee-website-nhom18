package com.nhom18.coffee.order_tracking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.order_tracking.model.OrderDetailTracking;

@Repository
public interface OrderDetailTrackingRepository extends JpaRepository<OrderDetailTracking, Integer> {
    // Tìm toàn bộ chi tiết thuộc về 1 mã Order duy nhất
    List<OrderDetailTracking> findByOrderId(Integer orderId);
}