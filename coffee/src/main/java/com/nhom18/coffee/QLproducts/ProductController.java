package com.nhom18.coffee.QLproducts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // --- TASK 3: Danh sách Sản phẩm (Hỗ trợ Tìm kiếm, Lọc giá, Sắp xếp) ---
    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "0") Integer minPrice,
            @RequestParam(required = false, defaultValue = "1000000000") Integer maxPrice,
            @RequestParam(required = false, defaultValue = "asc") String sortMode
    ) {
        // Nếu Frontend truyền 'desc' thì sắp xếp giảm dần, ngược lại tăng dần
        Sort sort = sortMode.equalsIgnoreCase("desc") ? Sort.by("price").descending() : Sort.by("price").ascending();

        return productRepository.searchAndFilterProducts(keyword, minPrice, maxPrice, sort);
    }

    // --- TASK 4: Xem chi tiết 1 Sản phẩm ---
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productRepository.findById(id).orElse(null);
    }
}