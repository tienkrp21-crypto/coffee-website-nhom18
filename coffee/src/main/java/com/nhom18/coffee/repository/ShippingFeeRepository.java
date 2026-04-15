package com.nhom18.coffee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.entity.ShippingFee;

@Repository
public interface ShippingFeeRepository extends JpaRepository<ShippingFee, Integer> {
    
    // Tìm kiếm phí ship theo tên khu vực (hỗ trợ kiểm tra trùng lặp)
    Optional<ShippingFee> findByRegionName(String regionName);
}
