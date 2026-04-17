package com.nhom18.coffee.checkout.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.checkout.model.OrderDetail;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    
    // Hàm này dùng để lôi toàn bộ các món hàng thuộc về một đơn hàng cụ thể.
    // Phục vụ cho chức năng Hoàn kho (Restore Stock) khi thanh toán thất bại hoặc hủy đơn.
    List<OrderDetail> findByOrder_Id(Integer orderId); 
    
}