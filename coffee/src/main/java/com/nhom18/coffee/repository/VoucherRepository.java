package com.nhom18.coffee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.entity.Voucher;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    
    // Tự động tìm Voucher theo trường `code` (Ví dụ: GIAM20K)
    Optional<Voucher> findByCode(String code);
    
    // Tìm Voucher hợp lệ (vẫn còn hoạt động và mã trùng khớp)
    Optional<Voucher> findByCodeAndStatus(String code, Integer status);
}