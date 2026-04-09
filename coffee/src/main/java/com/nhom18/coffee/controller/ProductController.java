package com.nhom18.coffee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nhom18.coffee.dto.ApiResponse;
import com.nhom18.coffee.dto.ProductDTO;
import com.nhom18.coffee.entity.Product;
import com.nhom18.coffee.repository.ProductRepository;
import com.nhom18.coffee.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    // Giữ lại ProductRepository tạm thời để không làm hỏng code cũ của bạn (Task 3), 
    // tương lai ta sẽ chuyển nốt Task 3 qua Service.
    @Autowired
    private ProductRepository productRepository;

    // Constructor Injection (thay thế Lombok)
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // =======================================================
    // TASK 2: QUẢN LÝ SẢN PHẨM (ADMIN)
    // =======================================================

    // 1. Phân trang, Tìm kiếm, Lọc theo Category
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getAllProductsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
        
        Page<ProductDTO> products = productService.getAllProducts(page, size, keyword, categoryId);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    // 2. Tạo sản phẩm mới (Có Validate)
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(ApiResponse.success("Tạo sản phẩm thành công", productService.createProduct(productDTO)));
    }

    // Lấy chi tiết một sản phẩm theo ID (Admin)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    // 3. Cập nhật thông tin sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Integer id, 
            @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công", productService.updateProduct(id, productDTO)));
    }

    // 4. Xóa (Soft Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm thành công", null));
    }

    // =======================================================
    // TASK 3 & 4 CŨ (CHƯA REFACOR): CHỈ DÀNH CHO CLIENT
    // Đã đổi mapping url tránh trùng lặp, lưu ý có thể refactor sau
    // =======================================================

    @GetMapping("/client/search")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProductsClient(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "0") Integer minPrice,
            @RequestParam(required = false, defaultValue = "1000000000") Integer maxPrice,
            @RequestParam(required = false, defaultValue = "asc") String sortMode
    ) {
        Sort sort = sortMode.equalsIgnoreCase("desc") ? Sort.by("price").descending() : Sort.by("price").ascending();
        return ResponseEntity.ok(ApiResponse.success(productRepository.searchAndFilterProducts(keyword, minPrice, maxPrice, sort)));
    }

    @GetMapping("/{id}/client")
    public ResponseEntity<ApiResponse<Product>> getProductByIdClient(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(productRepository.findById(id).orElse(null)));
    }
}