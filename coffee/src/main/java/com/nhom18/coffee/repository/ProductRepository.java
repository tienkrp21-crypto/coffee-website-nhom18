package com.nhom18.coffee.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Câu lệnh SQL "Tối ưu hóa" giúp tìm kiếm tên và lọc trong khoảng giá
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
            "p.price >= :minPrice AND p.price <= :maxPrice")
    List<Product> searchAndFilterProducts(String keyword, Integer minPrice, Integer maxPrice, Sort sort);
}