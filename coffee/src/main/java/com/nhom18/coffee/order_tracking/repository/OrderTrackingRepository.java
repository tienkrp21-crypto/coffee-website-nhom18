package com.nhom18.coffee.order_tracking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.order_tracking.model.OrderTracking;

@Repository
public interface OrderTrackingRepository extends JpaRepository<OrderTracking, Integer> {
    // Tự động tìm và trả về danh sách Order sắp xếp từ mới nhất đến cũ nhất
    List<OrderTracking> findByUserIdOrderByCreatedAtDesc(Integer userId);
    
    // THÊM DÒNG NÀY: Giúp tìm ra đơn hàng khi chỉ có orderCode trong tay
    Optional<OrderTracking> findByOrderCode(Long orderCode);
}