package com.nhom18.coffee.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nhom18.coffee.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Câu lệnh SQL "Tối ưu hóa" giúp tìm kiếm tên và lọc trong khoảng giá
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
            "p.price >= :minPrice AND p.price <= :maxPrice")
    List<Product> searchAndFilterProducts(String keyword, Integer minPrice, Integer maxPrice, Sort sort);

    // --- BỔ SUNG CHO TASK 2 ---

    // 1. Lấy danh sách sản phẩm theo trạng thái (có phân trang)
    Page<Product> findByStatus(Integer status, Pageable pageable);

    // 2. Lấy danh sách theo Category và trạng thái (có phân trang)
    Page<Product> findByCategoryIdAndStatus(Integer categoryId, Integer status, Pageable pageable);

    // 3. Tìm kiếm linh hoạt theo Tên hoặc SKU (có phân trang)
    @Query("SELECT p FROM Product p WHERE p.status = :status AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") Integer status, Pageable pageable);

    // 4. Kiểm tra xem SKU có trùng không
    boolean existsBySku(String sku);

    // 5. Kiểm tra xe Tên Sản phẩm có trùng khi Cập nhật không (bỏ qua ID hiện tại)
    boolean existsByNameAndIdNot(String name, Integer id);
}